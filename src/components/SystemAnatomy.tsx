import { Component, Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react';
import type { ReactNode, PointerEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowDown, ArrowRight, ChevronLeft, ChevronRight, Layers, Minus, Move, MoveUpRight, Play, X, Plus, Rotate3D, RotateCcw, ZoomOut } from 'lucide-react';
import { EXHIBITION_LAYERS } from '../data/cvData';
import { JOURNEY_CONNECTIONS, JOURNEY_NODES, JOURNEY_PHASES, JOURNEY_SCROLL_STEPS, journeyTravel } from '../data/architectureJourney';
import type { JourneyMotion } from '../data/architectureJourney';

const DepthJourneyScene = lazy(() => import('./canvas/DepthJourneyScene'));

class JourneyBoundary extends Component<{ children: ReactNode; onUnavailable: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onUnavailable(); }
  render() { return this.state.failed ? null : this.props.children; }
}

export const SystemAnatomy = ({ theme }: { theme: 'light' | 'dark' }) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const inspectorRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const markers = useRef<(HTMLButtonElement | null)[]>([]);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const phaseRef = useRef(0);
  const wheelAt = useRef(0);
  const wake = useRef(() => {});
  const input = useRef<JourneyMotion>({ progress: 0, velocity: 0, updatedAt: 0, interactionAt: 0, yaw: 0, pitch: 0, panX: 0, panY: 0, panScale: 0.01, pointerX: 0, pointerY: 0, focusDistance: 3.6, selectedNode: null, hoveredNode: null });
  const drag = useRef<{ id: number; x: number; y: number; yaw: number; pitch: number; panX: number; panY: number; scale: number; pan: boolean; target: HTMLCanvasElement } | null>(null);
  const [phase, setPhase] = useState(0);
  const [cameraMode, setCameraMode] = useState<'rotate' | 'pan' | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [exploring, setExploring] = useState(false);
  const [wheelZoom, setWheelZoom] = useState(false);
  const [visible, setVisible] = useState(false);
  const [ready, setReady] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);
  const [compact, setCompact] = useState(false);
  const staticJourney = !exploring || reducedMotion || unavailable || compact;
  const layerIndex = Math.max(0, phase - 1);
  const layer = EXHIBITION_LAYERS[layerIndex];
  const node = JOURNEY_NODES[layerIndex].find((candidate) => candidate.id === selectedNode);
  const onReady = useCallback(() => setReady(true), []);
  const onUnavailable = useCallback(() => { setUnavailable(true); setReady(false); }, []);
  useEffect(() => { if (ready) wake.current(); }, [ready]);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const smallViewport = window.matchMedia('(max-height: 500px)');
    const update = () => setReducedMotion(preference.matches);
    const resize = () => setCompact(smallViewport.matches);
    update(); resize();
    preference.addEventListener('change', update);
    smallViewport.addEventListener('change', resize);
    const visibility = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    if (stageRef.current) visibility.observe(stageRef.current);
    if (window.location.hash === '#architecture-stack' || window.location.hash === '#system') {
      document.getElementById(window.location.hash.slice(1))?.scrollIntoView({ behavior: 'instant' });
    }
    return () => { preference.removeEventListener('change', update); smallViewport.removeEventListener('change', resize); visibility.disconnect(); };
  }, []);

  const updateProgress = useCallback((progress: number, velocity = 0) => {
    const current = input.current;
    current.progress = Math.max(0, Math.min(1, progress));
    current.velocity = velocity;
    current.updatedAt = performance.now();
    current.interactionAt = current.updatedAt;
    stageRef.current?.style.setProperty('--journey-progress', String(current.progress));
    const next = Math.min(5, Math.round(journeyTravel(current.progress)));
    if (phaseRef.current !== next) {
      phaseRef.current = next;
      setPhase(next);
      setSelectedNode(null);
      Object.assign(current, { selectedNode: null, hoveredNode: null, yaw: 0, pitch: 0, panX: 0, panY: 0, focusDistance: 3.6 });
      setCameraMode(null);
    }
    wake.current();
  }, []);

  useEffect(() => {
    if (inspectorRef.current) inspectorRef.current.scrollTop = 0;
    const tab = tabs.current[phase];
    if (tab?.parentElement) tab.parentElement.scrollTo({ left: Math.max(0, tab.offsetLeft - tab.parentElement.offsetLeft - tab.parentElement.clientWidth / 2 + tab.offsetWidth / 2), behavior: 'instant' });
  }, [phase]);

  const revealSelection = useCallback(() => {
    const panel = inspectorRef.current;
    if (!selectedNode || !panel) return;
    const detail = panel.querySelector('.journey-node-detail');
    if (!detail) return;
    const overflow = detail.getBoundingClientRect().bottom - panel.getBoundingClientRect().bottom + 16;
    if (overflow > 0) panel.scrollBy({ top: overflow, behavior: reducedMotion ? 'instant' : 'smooth' });
  }, [selectedNode, reducedMotion]);
  useEffect(revealSelection, [revealSelection]);

  const zoomNode = useCallback((delta: number) => {
    const current = input.current;
    const distance = Math.max(2.2, Math.min(9, current.focusDistance + delta));
    if (distance === current.focusDistance) return false;
    current.focusDistance = distance;
    current.interactionAt = performance.now();
    wake.current();
    return true;
  }, []);

  useEffect(() => {
    const visual = visualRef.current;
    if (!visual || !exploring || !wheelZoom || !ready || unavailable || reducedMotion) return;
    const scroll = (event: WheelEvent) => {
      if (event.ctrlKey || event.shiftKey || !event.deltaY || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      // Browsers can keep sending a wheel gesture to its original target after the pointer leaves.
      const bounds = visual.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX >= bounds.right || event.clientY < bounds.top || event.clientY >= bounds.bottom) return;
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? visual.clientHeight : 1;
      if (input.current.selectedNode) {
        if (zoomNode(Math.max(-120, Math.min(120, event.deltaY * unit)) * 0.006)) event.preventDefault();
        return;
      }
      if (staticJourney) return;
      const stepDistance = Math.max(500, visual.clientHeight);
      const delta = Math.max(-stepDistance * 0.35, Math.min(stepDistance * 0.35, event.deltaY * unit));
      const progress = Math.max(0, Math.min(1, input.current.progress + delta / (stepDistance * JOURNEY_SCROLL_STEPS)));
      if (progress === input.current.progress) return;
      const now = performance.now();
      const velocity = Math.max(-1, Math.min(1, delta / (Math.max(16, now - wheelAt.current) * 1.8)));
      wheelAt.current = now;
      event.preventDefault();
      updateProgress(progress, velocity);
    };
    visual.addEventListener('wheel', scroll, { passive: false });
    return () => visual.removeEventListener('wheel', scroll);
  }, [exploring, wheelZoom, ready, unavailable, reducedMotion, staticJourney, zoomNode, updateProgress]);

  useEffect(() => { setWheelZoom(false); }, [selectedNode, phase, visible]);

  const goToPhase = useCallback((next: number, nodeId: string | null = null) => {
    const target = Math.max(0, Math.min(5, next));
    updateProgress(target / JOURNEY_SCROLL_STEPS);
    setSelectedNode(nodeId);
    input.current.selectedNode = nodeId;
    input.current.yaw = 0;
    input.current.pitch = 0;
    input.current.panX = 0;
    input.current.panY = 0;
    input.current.focusDistance = nodeId ? 4.6 : 3.6;
    setCameraMode(nodeId ? 'rotate' : null);
    input.current.hoveredNode = null;
    input.current.interactionAt = performance.now();
    wake.current();
  }, [updateProgress]);
  const inspectNode = useCallback((board: number, nodeId: string) => goToPhase(board + 1, nodeId), [goToPhase]);
  const startExploring = () => { setUnavailable(false); setReady(false); setWheelZoom(false); setExploring(true); };
  const exitExploring = () => {
    if (drag.current?.target.hasPointerCapture(drag.current.id)) drag.current.target.releasePointerCapture(drag.current.id);
    drag.current = null;
    input.current.velocity = 0;
    input.current.pointerX = 0;
    input.current.pointerY = 0;
    setWheelZoom(false); setReady(false); setCameraMode(null); setExploring(false);
  };
  const resetRotation = () => {
    Object.assign(input.current, { yaw: 0, pitch: 0, pointerX: 0, pointerY: 0, interactionAt: performance.now() });
    wake.current();
  };
  const resetView = () => {
    Object.assign(input.current, { yaw: 0, pitch: 0, panX: 0, panY: 0, focusDistance: selectedNode ? 4.6 : 3.6, pointerX: 0, pointerY: 0, interactionAt: performance.now() });
    wake.current();
  };
  const resetFocus = () => {
    setSelectedNode(null);
    input.current.selectedNode = null;
    setCameraMode(null);
    resetView();
  };

  const movePointer = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse') {
      const bounds = event.currentTarget.getBoundingClientRect();
      input.current.pointerX = (event.clientX - bounds.left) / bounds.width * 2 - 1;
      input.current.pointerY = (event.clientY - bounds.top) / bounds.height * 2 - 1;
    }
    if (drag.current?.id === event.pointerId) {
      const current = drag.current;
      const bounds = event.currentTarget.getBoundingClientRect();
      if (current.pan) {
        const limit = current.scale * bounds.height * 1.5;
        input.current.panX = Math.max(-limit, Math.min(limit, current.panX - (event.clientX - current.x) * current.scale));
        input.current.panY = Math.max(-limit, Math.min(limit, current.panY + (event.clientY - current.y) * current.scale));
      } else {
        input.current.yaw = current.yaw - (event.clientX - current.x) / bounds.width * Math.PI * 2;
        input.current.pitch = Math.max(-1.35, Math.min(1.35, current.pitch - (event.clientY - current.y) / bounds.height * Math.PI));
      }
      input.current.interactionAt = performance.now();
    }
    wake.current();
  };
  const releasePointer = (event: PointerEvent<HTMLDivElement>) => {
    if (drag.current?.id !== event.pointerId) return;
    if (drag.current.target.hasPointerCapture(event.pointerId)) drag.current.target.releasePointerCapture(event.pointerId);
    drag.current = null;
  };

  return (
    <section id="system" className="section section-alt">
      <div className="container">
        <div className="journey-heading">
          <div className="chapter-badge"><Layers size={13} /><span>CHAPTER 03 // INSIDE THE MACHINE</span></div>
          <h2 className="chapter-title">Inside <span className="accent-patina">the Machine.</span></h2>
          <p className="chapter-desc">Follow a user action from the interface to the API, database, and physical gate. Read the layers below, or choose to explore the same responsibilities in 3D.</p>
        </div>
        <div ref={trackRef} id="architecture-stack" className={`journey-track ${staticJourney ? 'is-static' : ''}`} onKeyDown={event => {
          if (event.key === 'Escape' && exploring) { event.preventDefault(); exitExploring(); }
        }}>
          <div ref={stageRef} className="journey-stage" data-phase={phase} data-exploring={exploring} data-focused={!!selectedNode}>
            <div className="journey-toolbar">
              <div><span className="journey-eyebrow">ARCHITECTURE GALAXY</span><strong>{exploring ? 'Explore in 3D · Esc to exit' : 'Read first. Explore at your own pace.'}</strong></div>
              <div className="journey-toolbar-actions">
                <button type="button" className="journey-mode-toggle" aria-pressed={exploring} aria-controls="journey-scene" onClick={exploring ? exitExploring : startExploring}>
                  {exploring ? <X size={14} /> : <Play size={14} />}{exploring ? 'Exit 3D' : unavailable ? 'Retry 3D' : 'Explore in 3D'}
                </button>
                <a href="#pressure" className="journey-skip" onClick={() => { setWheelZoom(false); }}>Skip experience <MoveUpRight size={14} /></a>
              </div>
            </div>
            <div className="journey-tabs" role="tablist" aria-label="Architecture journey stages">
              {JOURNEY_PHASES.map((label, index) => (
                <button key={label} id={`journey-tab-${index}`} ref={(button) => { tabs.current[index] = button; }}
                  type="button" role="tab" aria-selected={phase === index} aria-controls="journey-inspection" tabIndex={phase === index ? 0 : -1}
                  onClick={() => goToPhase(index)} onKeyDown={(event) => {
                    let next = index;
                    if (event.key === 'ArrowRight') next = Math.min(5, index + 1);
                    else if (event.key === 'ArrowLeft') next = Math.max(0, index - 1);
                    else if (event.key === 'Home') next = 0;
                    else if (event.key === 'End') next = 5;
                    else return;
                    event.preventDefault(); goToPhase(next); tabs.current[next]?.focus({ preventScroll: true });
                  }}><span>0{index}</span>{label}</button>
              ))}
            </div>
            <div className="journey-body">
              <div ref={visualRef} id="journey-scene" className={`journey-visual ${cameraMode ? `is-manipulating is-${cameraMode}` : ''}`} tabIndex={ready && !unavailable ? 0 : -1}
                onPointerMove={movePointer} onPointerDown={(event) => {
                if (!ready || ![0, 2].includes(event.button) || !(event.target instanceof HTMLCanvasElement)) return;
                if (event.pointerType !== 'touch' || cameraMode) event.preventDefault();
                event.currentTarget.focus({ preventScroll: true });
                drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY, yaw: input.current.yaw, pitch: input.current.pitch, panX: input.current.panX, panY: input.current.panY, scale: input.current.panScale, pan: cameraMode === 'pan' || event.shiftKey || event.button === 2, target: event.target };
                event.target.setPointerCapture(event.pointerId);
              }} onPointerUp={releasePointer} onPointerCancel={releasePointer} onLostPointerCapture={releasePointer}
                onContextMenu={(event) => { if (event.target instanceof HTMLCanvasElement) event.preventDefault(); }}
                onKeyDown={(event) => {
                  if (event.target !== event.currentTarget) return;
                  const current = input.current;
                  if (event.key === 'Escape') return;
                  else if (event.key === 'Home') resetRotation();
                  else if (event.key.toLowerCase() === 'r') resetView();
                  else if (event.key === '+' || event.key === '=') zoomNode(-0.6);
                  else if (event.key === '-') zoomNode(0.6);
                  else if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
                    const horizontal = event.key === 'ArrowLeft' ? -1 : event.key === 'ArrowRight' ? 1 : 0;
                    const vertical = event.key === 'ArrowUp' ? -1 : event.key === 'ArrowDown' ? 1 : 0;
                    if (event.shiftKey || cameraMode === 'pan') { current.panX += horizontal * 0.2; current.panY -= vertical * 0.2; }
                    else { current.yaw += horizontal * 0.15; current.pitch = Math.max(-1.35, Math.min(1.35, current.pitch + vertical * 0.15)); }
                    current.interactionAt = performance.now(); wake.current();
                  } else return;
                  event.preventDefault();
                }}
                onPointerLeave={() => { setWheelZoom(false); input.current.pointerX = 0; input.current.pointerY = 0; wake.current(); }}
                role="group" aria-label="3D architecture camera. Drag to rotate; Shift or right drag to pan. Arrow keys rotate, Shift and arrows pan. Home resets rotation, R resets the view, Escape exits 3D. Wheel camera controls require the explicit toggle.">
                <div className={`journey-atmosphere ${visible && ready && !reducedMotion && !selectedNode ? 'is-active' : ''}`} aria-hidden="true">
                  <div className="journey-sun" />
                  {[0, 1, 2, 3].map(comet => <span key={comet} className="journey-comet" />)}
                </div>
                {exploring && !unavailable && <JourneyBoundary onUnavailable={onUnavailable}><Suspense fallback={null}>
                  <DepthJourneyScene motion={input} wake={wake} active={visible} reducedMotion={reducedMotion} theme={theme} focusedNode={selectedNode}
                    markers={markers} onInspect={inspectNode} onReady={onReady} onUnavailable={onUnavailable} />
                </Suspense></JourneyBoundary>}
                {!ready && <div className="journey-fallback">
                  <img className="journey-poster" src={`${import.meta.env.BASE_URL}hero-anatomy-core-640.webp`} alt="" width={640} height={360} loading="lazy" decoding="async" />
                  <div className="journey-fallback-orbit" aria-hidden="true"><Layers size={42} /></div>
                  <strong>{unavailable ? 'The architecture is still here.' : exploring ? 'Preparing your 3D view…' : 'Five layers. One connected system.'}</strong>
                  <p role="status">{unavailable ? '3D could not start. Read the layers and node details with the tabs.' : exploring ? 'You can keep reading while the scene loads.' : 'Tabs and node details work without 3D. Enable the scene when you want to look closer.'}</p>
                  <div>{EXHIBITION_LAYERS.map((item, index) => <button key={item.id} onClick={() => goToPhase(index + 1)}>{item.slabLabel}<ArrowRight size={12} /></button>)}</div>
                </div>}
                {ready && <div className="journey-scene-caption" aria-hidden="true"><span>0{phase} / 05</span><strong>{node?.title ?? JOURNEY_PHASES[phase]}</strong><span>{selectedNode ? `DRAG TO ROTATE · ${wheelZoom ? 'WHEEL ZOOM ON' : 'USE + / − TO ZOOM'}` : 'DRAG TO ROTATE · SELECT A MODULE TO INSPECT'}</span></div>}
                {ready && !unavailable && <div className="journey-scene-markers" role="group" aria-label="Explore architecture in the scene">
                  {EXHIBITION_LAYERS.map((item, index) => <button key={item.id} ref={element => { markers.current[index] = element; }} hidden type="button"
                    className="journey-scene-marker is-layer" aria-label={`Explore ${JOURNEY_PHASES[index + 1]} layer`} onClick={() => { goToPhase(index + 1); tabs.current[index + 1]?.focus({ preventScroll: true }); }}>
                    <span className="journey-marker-number">{item.number}</span><strong>{JOURNEY_PHASES[index + 1]}</strong><ChevronRight size={12} />
                  </button>)}
                  {JOURNEY_NODES.flatMap((nodes, board) => nodes.map((item, index) => <button key={item.id} ref={element => { markers.current[5 + board * 3 + index] = element; }} hidden type="button"
                    className="journey-scene-marker is-node" aria-label={`Inspect ${item.label}: ${item.title}`} aria-pressed={selectedNode === item.id} title={item.title}
                    onPointerEnter={() => { input.current.hoveredNode = item.id; input.current.interactionAt = performance.now(); wake.current(); }}
                    onPointerLeave={() => { input.current.hoveredNode = null; wake.current(); }} onClick={() => inspectNode(board, item.id)}>
                    <span className="journey-marker-dot" /><strong>{item.label}</strong><MoveUpRight size={11} />
                  </button>))}
                </div>}
                {ready && !unavailable && <div className="journey-focus-controls" role="group" aria-label="3D camera controls">
                  <button type="button" aria-pressed={cameraMode === 'rotate'} onClick={() => setCameraMode('rotate')}><Rotate3D size={15} />Rotate</button>
                  <button type="button" aria-pressed={cameraMode === 'pan'} onClick={() => setCameraMode('pan')}><Move size={15} />Pan</button>
                  <button type="button" aria-label="Zoom in" onClick={() => zoomNode(-0.6)}><Plus size={16} /></button>
                  <button type="button" aria-label="Zoom out" onClick={() => zoomNode(0.6)}><Minus size={16} /></button>
                  {!reducedMotion && <button type="button" className="journey-wheel-toggle" aria-pressed={wheelZoom} onClick={() => setWheelZoom(value => !value)}>{selectedNode ? 'Wheel zoom' : 'Scroll camera'} {wheelZoom ? 'on' : 'off'}</button>}
                  <button type="button" aria-label="Reset camera view" title="Reset camera view (R)" onClick={resetView}><RotateCcw size={15} /></button>
                  {(selectedNode || cameraMode) && <button type="button" className="journey-reset-focus" aria-label={selectedNode ? 'Back to layer' : 'Resume scroll journey'} onClick={resetFocus}><ZoomOut size={15} /><span className="journey-camera-return">{selectedNode ? 'Back to layer' : 'Resume scroll'}</span><span className="journey-camera-return-mobile">{selectedNode ? 'Back' : 'Scroll'}</span></button>}
                </div>}
              </div>
              <div ref={inspectorRef} id="journey-inspection" className="journey-inspector" role="tabpanel" aria-labelledby={`journey-tab-${phase}`} tabIndex={0}>
                <AnimatePresence initial={false} mode="wait">
                  <motion.div key={phase} initial={{ opacity: 0, y: reducedMotion ? 0 : 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: reducedMotion ? 0 : 0.14 }} onAnimationComplete={revealSelection}>
                    <p className="journey-eyebrow">{phase === 0 ? 'THE BIG PICTURE' : `LAYER 0${phase} / INSPECTION`}</p>
                    <h3>{phase === 0 ? 'Five layers. One connected system.' : layer.title}</h3>
                    <p className="journey-summary">{phase === 0 ? 'Start with a layer. Inspect its modules, then follow how data moves from the interface to the physical world.' : phase === 2 ? 'State at the core. Reducers compute updates; effects dispatch asynchronous results. Orbits represent responsibilities.' : layer.architecturalRole}</p>
                    {phase === 0 ? <div className="journey-overview-list">{EXHIBITION_LAYERS.map((item, index) => <button key={item.id} onClick={() => goToPhase(index + 1)}><span>{item.number}</span><div><strong>{JOURNEY_PHASES[index + 1]}</strong><small>{item.chipCaption}</small></div><span className="journey-layer-count">{JOURNEY_NODES[index].length} nodes</span><ChevronRight size={14} /></button>)}</div> : <>
                      <p className="journey-module-label">MODULES <span>Select to inspect</span></p>
                      <div className="journey-node-list" role="group" aria-label="Inspect module nodes">{JOURNEY_NODES[layerIndex].map((item) => <button key={item.id} type="button" aria-pressed={selectedNode === item.id} onClick={() => inspectNode(layerIndex, item.id)}><span />{item.label}</button>)}</div>
                      <div className="journey-node-detail" role="status"><strong>{node?.title ?? 'Select a node'}</strong><p>{node?.description ?? 'Select a node in the scene or use the node buttons above.'}</p></div>
                      <div className="journey-tags">{layer.technologies.map((technology) => <span key={technology}>{technology}</span>)}</div>
                    </>}
                    <div className="journey-signal-paths"><span className="journey-eyebrow">SIGNAL FLOW / ILLUSTRATIVE</span><p>Interface → State → API → Database → Edge gateway</p>{JOURNEY_CONNECTIONS.filter((connection) => phase === 0 || phase === 5 || connection.from === layerIndex || connection.to === layerIndex).map((connection) => <p key={connection.label}><ArrowRight size={12} />{connection.label}</p>)}</div>
                    {phase > 0 && <details className="journey-decisions"><summary>Engineering decisions & project context</summary><p>{layer.description}</p><strong>Why this design</strong><p>{layer.engineeringRationale}</p><strong>Trade-off</strong><p>{layer.tradeoffs}</p><strong>Project context</strong><p>{layer.experienceContext}</p></details>}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
            <div className="journey-footer">
              <p><ArrowDown size={14} />{wheelZoom ? 'Wheel controls are on. Move outside the scene to restore page scrolling.' : !exploring || unavailable ? 'Choose a layer. Page scrolling stays free.' : selectedNode ? 'Drag to rotate. Use + / − to zoom.' : 'Drag to rotate. Choose a stage, or enable Scroll camera. Esc exits 3D.'}</p>
              <div>{ready && <button type="button" className="journey-rotation-reset" onClick={resetRotation} title="Reset 3D rotation (Home)"><RotateCcw size={15} />Reset rotation</button>}<button type="button" onClick={() => goToPhase(0)} aria-label="Return to architecture overview"><RotateCcw size={15} /></button><button type="button" disabled={phase === 0} onClick={() => goToPhase(phase - 1)} aria-label="Previous architecture stage"><ChevronLeft size={17} /></button><button type="button" disabled={phase === 5} onClick={() => goToPhase(phase + 1)} aria-label="Next architecture stage"><ChevronRight size={17} /></button></div>
            </div>
            <div className="journey-progress" role="progressbar" aria-label="Architecture journey progress" aria-valuemin={0} aria-valuemax={5} aria-valuenow={phase} aria-valuetext={JOURNEY_PHASES[phase]}><span /></div>
          </div>
        </div>
        <details className="architecture-summary">
          <summary>Read the five architecture layers</summary>
          <div className="architecture-summary-content">
            {EXHIBITION_LAYERS.map(item => <article key={item.id}>
              <h3>{item.number} / {item.title}</h3>
              <p>{item.description}</p>
            </article>)}
          </div>
        </details>
      </div>
    </section>
  );
};

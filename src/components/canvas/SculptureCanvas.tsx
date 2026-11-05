import React, { useState, useEffect, useRef } from 'react';
import { NanoCircuitBackdrop } from './NanoCircuitBackdrop';
import {
  CircuitSignalBoard,
  CIRCUIT_DESKTOP_EXIT_Y,
  CIRCUIT_MOBILE_EXIT_X,
  CIRCUIT_CHARGE_MS,
  CIRCUIT_BURST_MS,
} from './CircuitSignalBoard';
import { inspectorTracePaths, SignalDecode } from './InspectorSignal';
import { MODULE_LIGHTS, MODULE_POSITIONS, type SystemModuleId } from './systemModuleLayout';
import { CircuitParticles } from './CircuitParticles';
import { ModuleEnergy } from './ModuleEnergy';
import './SculptureModules.css';
import {
  ExternalLink,
  CheckCircle2,
  X,
} from 'lucide-react';

export interface SystemNode {
  id: SystemModuleId;
  number: string;
  name: string;
  subTitle: string;
  category: string;
  color: 'cyan' | 'amber';
  badgeLabel: string;
  technologies: string[];
  specs: string[];
  description: string;
  targetChapter: string;
}

const SYSTEM_NODES: SystemNode[] = [
  {
    id: 'core',
    number: '01',
    name: 'SYSTEM CORE',
    subTitle: 'Architecture & Engineering',
    category: 'CENTRAL PROCESSOR',
    color: 'cyan',
    badgeLabel: 'KT CHIP',
    technologies: ['Architecture', 'Engineering', 'Problem Solving', 'High Concurrency'],
    specs: ['Central Conduit Nexus', 'Fault-Tolerant Dispatch', 'Single Source of Truth'],
    description: 'The master architecture hub uniting deterministic client state, high-throughput microservices, transactional persistence, and offline IoT edge substrates.',
    targetChapter: '#origin',
  },
  {
    id: 'frontend',
    number: '02',
    name: 'FRONTEND',
    subTitle: 'React / TypeScript',
    category: 'DETERMINISTIC UI',
    color: 'cyan',
    badgeLabel: 'REACT / TS',
    technologies: ['React', 'TypeScript', 'UI/UX Performance', 'State Management'],
    specs: ['Explicit application state', 'Reusable UI components', 'Keyboard and accessible interactions'],
    description: 'Responsive interfaces with explicit loading states, reusable components, and accessibility improvements informed by WCAG guidance.',
    targetChapter: '#system',
  },
  {
    id: 'backend',
    number: '03',
    name: 'BACKEND',
    subTitle: 'Golang / API Design',
    category: 'DISTRIBUTED SERVICES',
    color: 'amber',
    badgeLabel: 'GOLANG GIN',
    technologies: ['Golang Gin', 'API Contracts', 'Microservices', 'Concurrency Channels'],
    specs: ['Concurrent goroutine workers', 'Validated API contracts', 'Transactional service boundaries'],
    description: 'Resilient Golang microservices processing concurrent transactions, enforcing strict contracts, and handling peak edge load.',
    targetChapter: '#pressure',
  },
  {
    id: 'infra',
    number: '04',
    name: 'INFRASTRUCTURE',
    subTitle: 'Cloud / DevOps',
    category: 'EDGE & CLUSTERS',
    color: 'amber',
    badgeLabel: 'K8S & EDGE',
    technologies: ['Cloud & Edge Gateways', 'Docker / Kubernetes', 'Monitoring / CI/CD', 'IoT Turnstiles'],
    specs: ['Offline-First failover', 'Automated CI/CD pipelines', 'Hardware relay interfacing'],
    description: 'Edge controllers use local ticket snapshots during WAN interruptions and synchronize deferred events when connectivity returns.',
    targetChapter: '#reality',
  },
  {
    id: 'data',
    number: '05',
    name: 'DATA',
    subTitle: 'PostgreSQL / Redis',
    category: 'TRANSACTIONAL INTEGRITY',
    color: 'cyan',
    badgeLabel: 'POSTGRES / REDIS',
    technologies: ['PostgreSQL', 'Redis Distributed Lock', 'Data Pipeline', 'Caching & Sync'],
    specs: ['Row-level transaction locks', 'Coordinated ticket validation', 'Deferred event synchronization'],
    description: 'PostgreSQL transactions protect central ticket state, with Redis supporting coordination. Disconnected gateways require reconciliation and a duplicate-admission policy.',
    targetChapter: '#system',
  },
];

const BRIDGE_TRAVEL_MS = 65;
const BRIDGE_START_MS = CIRCUIT_CHARGE_MS + CIRCUIT_BURST_MS;
const SIGNAL_ARRIVAL_MS = BRIDGE_START_MS + BRIDGE_TRAVEL_MS;
const SEQUENCE_END_MS = 790;
type SignalPhase = 'idle' | 'transmitting' | 'opening' | 'revealing';

export const SculptureCanvas: React.FC = () => {
  const [activeNodeId, setActiveNodeId] = useState<SystemModuleId | null>(null);
  const [displayedId, setDisplayedId] = useState<SystemModuleId | null>(null);
  const [phase, setPhase] = useState<SignalPhase>('idle');
  const [compact, setCompact] = useState(false);
  const exhibitRef = useRef<HTMLDivElement>(null);
  const depthRef = useRef<HTMLDivElement>(null);
  const inspectorRef = useRef<HTMLElement>(null);
  const bridgeRef = useRef<HTMLDivElement>(null);
  const traceRef = useRef<SVGSVGElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const sequenceTimers = useRef<number[]>([]);
  const displayedNode = SYSTEM_NODES.find(node => node.id === displayedId);
  const inspectorOpen = activeNodeId !== null;
  const transmitting = phase === 'transmitting';
  const revealing = phase === 'opening' || phase === 'revealing';

  useEffect(() => () => sequenceTimers.current.forEach(timer => window.clearTimeout(timer)), []);

  useEffect(() => {
    const query = matchMedia('(max-width: 759px)');
    const update = () => setCompact(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  // The flex connector only spans the chassis edge and the inspector inlet.
  useEffect(() => {
    const exhibit = exhibitRef.current;
    const viewport = depthRef.current;
    const inspector = inspectorRef.current;
    const bridge = bridgeRef.current;
    if (!exhibit || !viewport || !inspector || !bridge) return;

    const measure = () => {
      const origin = exhibit.getBoundingClientRect();
      const stage = viewport.getBoundingClientRect();
      const inlet = inspector.getBoundingClientRect();
      const x = compact ? stage.left + stage.width * CIRCUIT_MOBILE_EXIT_X : stage.right;
      const y = compact ? stage.bottom : stage.top + stage.height * CIRCUIT_DESKTOP_EXIT_Y;
      const length = compact ? inlet.top - y : inlet.left - x;
      bridge.style.setProperty('--bridge-x', `${x - origin.left}px`);
      bridge.style.setProperty('--bridge-y', `${y - origin.top}px`);
      bridge.style.setProperty('--bridge-length', `${Math.max(0, length)}px`);
      bridge.dataset.positioned = String(length > 0);

      if (!traceRef.current || inlet.height < 20 || inlet.width < 20) return;
      const offset = compact ? x - inlet.left : y - inlet.top;
      const edge = compact ? inlet.width : inlet.height;
      const port = Math.max(10, Math.min(edge - 10, offset));
      const paths = inspectorTracePaths(inlet.width, inlet.height, port, compact);
      inspector.style.setProperty('--inlet-position', `${port}px`);
      traceRef.current.querySelectorAll('path').forEach((path, index) => path.setAttribute('d', paths[index]));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(exhibit);
    observer.observe(viewport);
    observer.observe(inspector);
    if (viewport.parentElement) observer.observe(viewport.parentElement);
    return () => observer.disconnect();
  }, [compact, inspectorOpen, displayedId]);

  const stopSequence = () => {
    sequenceTimers.current.forEach(timer => window.clearTimeout(timer));
    sequenceTimers.current = [];
  };

  const selectNode = (requestedId: SystemModuleId | null, trigger?: HTMLButtonElement) => {
    if (trigger) triggerRef.current = trigger;
    const nodeId = requestedId === activeNodeId ? null : requestedId;
    if (nodeId === activeNodeId) return;
    stopSequence();
    setActiveNodeId(nodeId);

    if (!nodeId || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplayedId(nodeId);
      setPhase('idle');
      return;
    }

    setPhase('transmitting');
    sequenceTimers.current = [
      window.setTimeout(() => {
        setDisplayedId(nodeId);
        setPhase(displayedId ? 'revealing' : 'opening');
      }, SIGNAL_ARRIVAL_MS),
      window.setTimeout(() => setPhase('idle'), SEQUENCE_END_MS),
    ];
  };

  const closeInspector = () => {
    selectNode(null);
    triggerRef.current?.focus({ preventScroll: !compact });
  };

  return (
    <div ref={exhibitRef} className="cyber-exhibit"
      data-selected={inspectorOpen} data-phase={phase}
      style={{ '--module-color': MODULE_LIGHTS[activeNodeId ?? 'core'] } as React.CSSProperties}
      onKeyDown={event => {
      if (event.key === 'Escape' && inspectorOpen) closeInspector();
    }}>
      <div className="cyber-core-viewer" role="region" aria-label="Interactive System Architecture Exhibit">
        <div className="cyber-core-header">
          <div className="cyber-core-title">
            <span className="cyber-status-led" />
            <span className="cyber-title-main">KT-CORE // SYSTEM ANATOMY</span>
            <span className="cyber-title-status">● SIGNAL / PULSE</span>
          </div>
          <div className="cyber-node-tabs" role="group" aria-label="Select architecture module">
            {SYSTEM_NODES.map(node => (
              <button key={node.id} type="button" className={`cyber-tab-btn ${activeNodeId === node.id ? 'active' : ''} ${node.color}`}
                onClick={event => selectNode(node.id, event.currentTarget)} aria-pressed={activeNodeId === node.id}
                aria-controls="hero-module-detail" title={`${node.number} ${node.name} — ${node.subTitle}`}>
                <span className="cyber-tab-num">{node.number}</span> {node.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        <div ref={depthRef} className="cyber-core-viewport">
          <NanoCircuitBackdrop />
          <CircuitSignalBoard selectedId={activeNodeId} transmitting={transmitting} mobile={compact} />
          <div className="cyber-scene-mist" aria-hidden="true" />
          <div className="cyber-depth-rig">
            {SYSTEM_NODES.map(node => (
              <button key={node.id} type="button" data-node={node.id}
                className={`cyber-module ${node.color} ${node.id === 'core' ? 'is-core' : ''} ${activeNodeId === node.id ? 'is-selected' : ''}`}
                style={{ left: `${MODULE_POSITIONS[node.id].x}%`, top: `${MODULE_POSITIONS[node.id].y}%`,
                  '--module-color': MODULE_LIGHTS[node.id] } as React.CSSProperties}
                title={`${node.name} — ${node.subTitle}. Click to inspect.`}
                aria-pressed={activeNodeId === node.id} aria-controls="hero-module-detail"
                onClick={event => selectNode(node.id, event.currentTarget)}>
                <span className="cyber-module-socket" aria-hidden="true" />
                {transmitting && activeNodeId === node.id && <span className="cyber-module-shockwave" aria-hidden="true" />}
                <ModuleEnergy id={node.id} rear />
                <picture className="cyber-module-art">
                  <source type="image/avif" srcSet={`./hero-modules/${node.id}-384.avif 1x, ./hero-modules/${node.id}.avif 2x`} />
                  <img src={`./hero-modules/${node.id}-384.webp`} srcSet={`./hero-modules/${node.id}.webp 2x`}
                    width="768" height="768" alt="" decoding="async" draggable={false}
                    {...{ fetchpriority: node.id === 'core' ? 'high' : 'auto' }} />
                </picture>
                <ModuleEnergy id={node.id} />
                <span className="cyber-module-label">
                  <span className="cyber-module-number">{node.number}</span>{' '}
                  <strong>{node.name}</strong>
                  <span className="cyber-module-indicator" aria-hidden="true">{activeNodeId === node.id ? '●' : '+'}</span>
                </span>
              </button>
            ))}
          </div>
          <CircuitParticles />
          <span className="cyber-depth-label">NANO FABRIC / 05 MODULES</span>
          <span className="cyber-scene-hint">HOVER TO ILLUMINATE / SELECT TO INSPECT</span>
        </div>

        <div className="cyber-core-footer">
          <span className="cyber-signal-caption">Select a module to inspect. Select it again to close.</span>
        </div>
      </div>
      {inspectorOpen && (
        <div ref={bridgeRef} className="cyber-inspector-bridge" aria-hidden="true"
          style={{ '--bridge-delay': `${BRIDGE_START_MS}ms`, '--bridge-travel': `${BRIDGE_TRAVEL_MS}ms` } as React.CSSProperties}>
          <span className="cyber-bridge-channel">
            {transmitting && <span key={activeNodeId} className="cyber-bridge-pulse" />}
          </span>
          {revealing && <span className="cyber-bridge-receiver" />}
        </div>
      )}
      <aside ref={inspectorRef} className="cyber-module-inspector" aria-label="Module information" data-open={inspectorOpen}>
        {inspectorOpen && (
          <svg ref={traceRef} className="cyber-inspector-trace" aria-hidden="true" focusable="false">
            <path pathLength="100" />
            <path pathLength="100" />
          </svg>
        )}
        {transmitting && <span className="cyber-inspector-wait" aria-hidden="true">RECEIVING SIGNAL</span>}
        <div id="hero-module-detail" className="cyber-footer-readout" aria-live="polite" aria-atomic="true" aria-busy={transmitting}>
          {displayedNode ? (
            <div key={displayedNode.id} className="cyber-node-readout cyber-selection-banner" data-selected-module={displayedNode.id}>
              <button type="button" className="cyber-inspector-close" onClick={closeInspector} aria-label="Close module information"><X size={16} /></button>
              <div className="cyber-readout-copy">
                <div className="cyber-readout-connection" aria-hidden="true"><span>MODULE / {displayedNode.number}</span><span><i />MODULE ACTIVE</span></div>
                <span className="cyber-readout-eyebrow"><SignalDecode text={displayedNode.category} animate={revealing} /></span>
                <div className="cyber-readout-head">
                  <span className={`cyber-readout-pill ${displayedNode.color}`}>
                    <SignalDecode text={`${displayedNode.number} // ${displayedNode.name}`} animate={revealing} />
                  </span>
                  <span className="cyber-readout-sub">{displayedNode.subTitle}</span>
                </div>
                <p className="cyber-readout-desc">{displayedNode.description}</p>
                <div className="cyber-readout-techs">{displayedNode.technologies.map((tech, index) => (
                  <span key={tech} style={{ '--tech-index': index } as React.CSSProperties}>{tech}</span>
                ))}</div>
                <div className="cyber-readout-specs">{displayedNode.specs.map(spec => (
                  <span key={spec} className="cyber-spec-item"><CheckCircle2 size={12} color={MODULE_LIGHTS[displayedNode.id]} />{spec}</span>
                ))}</div>
                <a href={displayedNode.targetChapter} className="cyber-readout-link">Inspect in Exhibit <ExternalLink size={12} /></a>
              </div>
            </div>
          ) : (
            <div className="cyber-default-readout">
              <span className="cyber-readout-eyebrow">KT / ARCHITECTURE EXHIBIT</span>
              <strong>One machine. Five connected disciplines.</strong>
              <p>Explore the modules behind the work: interfaces, services, infrastructure and data, connected through the system core.</p>
              <p className="cyber-readout-instruction">Select a module to inspect its role, technologies and engineering decisions.</p>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
};

export default SculptureCanvas;

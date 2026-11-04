import { ArrowUpRight, ArrowRight, Ticket, ScanLine, ShoppingBag, Layers, Globe2, Check, BookOpen, GraduationCap, Accessibility, Play, Building2, ClipboardCheck, RefreshCw } from 'lucide-react';
import './project-sculpture-additions.css';

export function ProjectSculpture({ index, discipline }: { index: number; discipline: string }) {
  return <div className={`reality-sculpture reality-sculpture-${index}`} aria-hidden="true">
    <div className="reality-scene-horizon" />
    <span className="reality-scene-edition">0{index + 1}</span>
    <div className="reality-scene-orbit reality-orbit-one" /><div className="reality-scene-orbit reality-orbit-two" />
    {index === 0 && <div className="reality-access-world">
      <div className="reality-gateway"><div className="reality-device-top"><ScanLine size={24} /><i /></div><span>EDGE<br />GATEWAY</span><div className="reality-device-slots"><i /><i /><i /></div></div>
      <div className="reality-ticket"><div className="reality-ticket-top"><Ticket size={17} /><span>THEME PARK<br />ADMISSION</span><ArrowUpRight size={17} /></div><strong>A day<br />of possibility.</strong><div className="reality-ticket-cut" /><div className="reality-ticket-bottom"><span className="reality-qr" /><div><span>LOCAL VALIDATION</span><strong><Check size={13} /> Ready at the edge</strong></div></div></div>
      <div className="reality-gate"><span /><i /><div /></div><div className="reality-floor-trace"><i /><i /><i /></div>
      <span className="reality-floating-note"><span className="reality-small-dot" />CACHE → VALIDATE → SYNC</span>
    </div>}
    {index === 1 && <div className="reality-commerce-world">
      <div className="reality-browser"><div className="reality-browser-chrome"><i /><i /><i /><span>ATTRACTIONS / DISCOVER</span></div><div className="reality-storefront"><span>MAKE ROOM FOR</span><strong>Extraordinary.</strong><div className="reality-skyline"><i /><i /><i /><span /></div><div className="reality-storefront-footer"><span>Explore experiences</span><ArrowRight size={14} /></div></div></div>
      <div className="reality-mobile-ticket"><div className="reality-phone-notch" /><ShoppingBag size={22} /><span>YOUR NEXT<br />EXPERIENCE</span><div className="reality-mobile-landscape" /><div className="reality-mobile-checkout"><span>Ticket selection</span><Check size={14} /></div><div className="reality-mobile-button">Continue<ArrowRight size={12} /></div></div>
      <span className="reality-floating-note"><span className="reality-small-dot" />DISCOVER → CART → PAYMENT</span>
    </div>}
    {index === 2 && <div className="reality-content-world">
      <div className="reality-page-shadow reality-page-shadow-one" /><div className="reality-page-shadow reality-page-shadow-two" />
      <div className="reality-content-page"><div className="reality-content-masthead"><span className="reality-content-mark" /><span>CONTENT / COMPONENTS</span><i /><i /></div><div className="reality-content-hero"><span>BUILT TO BE REUSED</span><strong>One framework.<br />Many stories.</strong><div className="reality-content-graphic"><i /><i /><i /></div></div><div className="reality-content-modules">{[0, 1, 2].map(module => <div key={module}><span /><i /><i /></div>)}</div><div className="reality-content-bottom"><Layers size={13} /><span>Modular pages · Shared structure</span></div></div>
      <div className="reality-component-token"><Layers size={22} /><span>REUSABLE<br />AEM MODULES</span></div>
      <span className="reality-floating-note"><span className="reality-small-dot" />COMPOSE → AUTHOR → PUBLISH</span>
    </div>}
    {index === 3 && <div className="reality-virtual-world">
      <div className="reality-panorama-ring reality-panorama-ring-back" /><div className="reality-panorama-island"><div className="reality-landscape-sun" /><div className="reality-mountain reality-mountain-back" /><div className="reality-mountain reality-mountain-front" /><div className="reality-landscape-water" /><div className="reality-landmark"><i /><i /><i /><span /></div></div><div className="reality-panorama-ring reality-panorama-ring-front" />
      <div className="reality-viewfinder"><span /><span /><span /><span /><Globe2 size={28} /></div><div className="reality-compass"><span>N</span><i /><span>360°</span></div>
      <span className="reality-floating-note"><span className="reality-small-dot" />EXPLORE → INTERACT → DISCOVER</span>
    </div>}
    {index === 4 && <div className="reality-learning-world">
      <svg className="reality-learning-route" viewBox="0 0 600 520" fill="none"><path d="M 140 356 C 72 250 172 108 310 180 S 536 292 432 340" pathLength="100" /><path className="reality-learning-packet" d="M 140 356 C 72 250 172 108 310 180 S 536 292 432 340" pathLength="100" /></svg>
      <div className="reality-learning-window"><div className="reality-learning-chrome"><BookOpen size={13} /><span>OPEN LEARNING / EXPLORER</span><i /><i /><i /></div><div className="reality-learning-workspace"><div className="reality-learning-sidebar"><GraduationCap size={17} /><i /><i /><i /><span /></div><div className="reality-learning-content"><span>IDEAS WITHOUT BOUNDARIES</span><strong>A world<br />of learning.</strong><div className="reality-learning-landscape"><span /><i /><i /><i /></div><div className="reality-learning-courses">{[0, 1, 2].map(course => <div key={course}><span /><i /><i /><small /></div>)}</div></div></div></div>
      <div className="reality-learning-book"><div className="reality-learning-book-spine" /><div className="reality-learning-book-cover"><BookOpen size={27} /><span>CURIOUS<br />BY NATURE.</span><i /></div></div>
      <div className="reality-lesson-card"><div className="reality-lesson-kicker"><span>LESSON / EXPLORE</span><Play size={11} /></div><strong>Follow your<br />curiosity.</strong><div className="reality-lesson-progress"><i /></div><div className="reality-lesson-footer"><span>Keep discovering</span><ArrowUpRight size={13} /></div></div>
      <div className="reality-learning-access"><Accessibility size={18} /><span>INCLUSIVE<br />INTERFACES</span></div>
      <span className="reality-floating-note"><span className="reality-small-dot" />DISCOVER → LEARN → EXPLORE</span>
    </div>}
    {index === 5 && <div className="reality-inspection-world">
      <svg className="reality-inspection-route" viewBox="0 0 600 520" fill="none"><path d="M 170 358 L 212 385 L 374 385 L 455 303" pathLength="100" /><path className="reality-inspection-packet" d="M 170 358 L 212 385 L 374 385 L 455 303" pathLength="100" /></svg>
      <div className="reality-inspection-console"><div className="reality-inspection-chrome"><Building2 size={12} /><span>WEB / PROJECT WORKSPACE</span><i /><i /><i /></div><div className="reality-inspection-dashboard"><aside><span /><i /><i /><i /></aside><div className="reality-inspection-overview"><span>CONNECTED PERSPECTIVES</span><strong>From site<br />to screen.</strong><div className="reality-inspection-buildings"><div className="reality-inspection-block reality-inspection-block-one"><i /><i /><i /></div><div className="reality-inspection-block reality-inspection-block-two"><i /><i /><i /></div><div className="reality-inspection-block reality-inspection-block-three"><i /><i /><i /></div><div className="reality-inspection-scan" /></div><div className="reality-inspection-console-footer"><span /><i /><i /></div></div></div></div>
      <div className="reality-inspection-mobile"><div className="reality-inspection-speaker" /><div className="reality-inspection-mobile-screen"><div className="reality-inspection-mobile-heading"><ClipboardCheck size={20} /><span>FIELD<br />NOTES</span></div><div className="reality-inspection-mobile-image"><Building2 size={29} /><i /></div><div className="reality-inspection-checklist">{[0, 1, 2].map(row => <div key={row}><Check size={10} /><span /><i /></div>)}</div><div className="reality-inspection-mobile-footer"><RefreshCw size={12} /><span>WEB + MOBILE</span></div></div><span className="reality-inspection-mobile-home" /></div>
      <div className="reality-inspection-device"><div><ScanLine size={18} /><span /></div><i /><i /><i /></div><div className="reality-inspection-badge"><RefreshCw size={17} /><span>CONNECTED<br />EXPERIENCES</span></div>
      <span className="reality-floating-note"><span className="reality-small-dot" />WEB → MOBILE → CONNECT</span>
    </div>}
    <div className="reality-scene-caption"><span>CONCEPT / {discipline}</span><span>ILLUSTRATIVE PROJECT STUDY</span></div>
  </div>;
}

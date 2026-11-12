import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { ArrowRight, ArrowUpRight, ScanLine, Database, WifiOff, Check, Ticket, ShoppingBag, CreditCard, Layers, Image, Globe2, MapPin, Navigation, BookOpen, Accessibility, GraduationCap, Smartphone, Monitor, Cloud, Box, RotateCcw, Move3D } from 'lucide-react';
import './project-worlds.css';

const STUDIES = [
  { title: 'The gate stays open.', subtitle: 'TICKETING / EDGE SYSTEM', color: '#70e5be', steps: [
    ['Ticket services', 'Golang · PostgreSQL · Redis', 'Concurrent ticket orders pass through service APIs and database transactions. Redis coordination and row-level locks protect central inventory.'],
    ['Local validation', 'Linux gateway · Local cache', 'The edge gateway validates cached ticket snapshots and controls physical gates when the central connection is unavailable.'],
    ['Reconnect & reconcile', 'MQTT · Deferred events', 'Gateway events synchronize after connectivity returns. Offline admissions still need reconciliation and a duplicate-admission policy.'],
  ]},
  { title: 'A journey to extraordinary.', subtitle: 'MARINA BAY SANDS / COMMERCE', color: '#ecc38a', steps: [
    ['Discover', 'React · Next.js · SSR / SSG', 'Attraction pages and responsive discovery interfaces make experiences available across desktop and mobile. SSR/SSG supports public content and technical SEO.'],
    ['Build a basket', 'Redux · REST APIs', 'Product filters, ticket selections, authentication and shopping-cart state connect discovery to the purchasing journey.'],
    ['Complete checkout', 'Payment integrations · PWA', 'Integrated payment workflows and React Native Web experiences carry the purchase across web and mobile interfaces.'],
  ]},
  { title: 'One component. Many pages.', subtitle: 'TECHCOMBANK / AEM AUTHORING', color: '#ff8f83', steps: [
    ['Compose', 'Reusable AEM modules', 'Built and maintained modular components with Vanilla JavaScript so authors can assemble banking pages using shared building blocks.'],
    ['Manage content', 'Content fragments · Digital assets', 'Centralized assets, documents and content fragments support a consistent authoring structure across the banking information portal.'],
    ['Publish consistently', 'Technical SEO · Accessibility', 'Maintained authoring requirements and improved accessible component behavior and technical SEO across published pages.'],
  ]},
  { title: 'A place you can explore.', subtitle: 'VIRTUAL VIETNAM / IMMERSIVE WEB', color: '#8acbff', steps: [
    ['Enter the landscape', 'JavaScript · Three.js', 'Built a browser-based 3D / 360° experience presenting Vietnam attractions, without requiring a separate installed application.'],
    ['Explore in 360°', 'Interactive viewpoints', 'Developed the interactive experience and its frontend behavior, balancing graphics and asset costs with usable web content.'],
    ['Connect the experience', 'React · Tailwind CSS', 'Built reusable corporate frontend modules and collaborated with backend, product and marketing teams on delivery and technical SEO.'],
  ]},
  { title: 'Learning, without barriers.', subtitle: 'OPEN UNIVERSITY / LEARNING TOOLS', color: '#c1acff', steps: [
    ['Find a starting point', 'University homepage · Navigation', 'Built and maintained responsive homepage modules and interactive learning-tool interfaces using JavaScript, jQuery and Bootstrap.'],
    ['Support the transition', 'Drupal → Moodle', 'Integrated frontend modules with Drupal and adapted learning-tool functionality for the Moodle platform transition.'],
    ['Include more learners', 'Accessible interaction', 'Implemented accessibility improvements informed by WCAG guidance, with clearer navigation and usable interfaces across devices.'],
  ]},
  { title: 'One experience. Every screen.', subtitle: 'SOCOTEC / WEB + MOBILE', color: '#84dbef', steps: [
    ['Build the web interface', 'JavaScript · Bootstrap 4', 'Developed reusable frontend modules and interface updates, improving component usability and responsive behavior.'],
    ['Connect the platforms', 'Umbraco · Backend collaboration', 'Coordinated frontend integration with backend teams using Umbraco CMS, Docker and PostgreSQL.'],
    ['Carry it to mobile', 'Fliplet application', 'Worked on interface updates and integration between the web platform and the Fliplet-based mobile application.'],
  ]},
] as const;

function Window({ title, children, className = '' }: {title: string; children: ReactNode; className?: string}) {
  return <div className={`pw-window ${className}`}><div className="pw-chrome"><span><i /><i /><i /></span><small>{title}</small><ArrowUpRight size={12} /></div>{children}</div>;
}
function Chip({ icon, title, children, className = '' }: {icon: ReactNode; title: string; children: ReactNode; className?: string}) {
  return <div className={`pw-chip ${className}`}><div className="pw-chip-icon">{icon}</div><strong>{title}</strong><span>{children}</span><i className="pw-chip-led" /></div>;
}
function MiniRows({items}: {items: string[]}) {
  return <div className="pw-rows">{items.map(item=><div key={item}><Check size={12}/><span>{item}</span><i/></div>)}</div>;
}
function World({index}: {index: number}) {
  if(index === 0) return <>
    <Window title="CENTRAL / TICKET SERVICES" className="pw-layer pw-layer-back"><div className="pw-service"><Database/><strong>Ticket inventory</strong><span>GOLANG / POSTGRESQL</span><MiniRows items={['Order transaction','Inventory lock','OTA integration']}/></div></Window>
    <Chip className="pw-layer pw-layer-mid" icon={<WifiOff/>} title="EDGE / 01">Local ticket snapshot<div className="pw-server-vents"><i/><i/><i/></div><b>OFFLINE CAPABLE</b></Chip>
    <div className="pw-turnstile pw-layer pw-layer-front"><div className="pw-gate-post"><ScanLine/><span>SCAN</span><i/></div><div className="pw-gate-glass"><Check/><span>ADMIT</span></div><div className="pw-gate-post pw-gate-post-right"><i/></div><div className="pw-gate-base"/></div>
    <div className="pw-ticket-float"><Ticket/><span>ADMISSION PASS</span><div className="pw-barcode"/><b>LOCAL VALIDATION</b></div>
  </>;
  if(index === 1) return <>
    <Window title="MARINA BAY / EXPERIENCES" className="pw-layer pw-layer-back"><div className="pw-resort"><span>DISCOVER SINGAPORE</span><strong>Make a day<br/>of it.</strong><div className="pw-towers"><i/><i/><i/><b/></div><div className="pw-resort-water"/><small>ATTRACTIONS & EXPERIENCES <ArrowRight size={12}/></small></div></Window>
    <div className="pw-basket pw-layer pw-layer-mid"><ShoppingBag/><small>YOUR SELECTION</small><strong>A day of discovery</strong><div className="pw-basket-item"><Ticket/><span>Attraction tickets<br/><b>Choose a date · Select guests</b></span></div><MiniRows items={['Cart state','API integration']}/></div>
    <div className="pw-phone pw-layer pw-layer-front"><i className="pw-notch"/><CreditCard/><small>CHECKOUT</small><strong>Your next<br/>experience.</strong><div className="pw-phone-picture pw-phone-picture-resort"><Ticket/></div><MiniRows items={['Ticket selection','Payment method']}/><b className="pw-ui-button">Continue <ArrowRight size={12}/></b></div>
  </>;
  if(index === 2) return <>
    <Window title="AEM / COMPONENT LIBRARY" className="pw-layer pw-layer-back"><div className="pw-library"><span>BUILDING BLOCKS</span><strong>Designed once.<br/>Reused everywhere.</strong><div className="pw-component-grid">{['Navigation','Hero banner','Content card','Asset block'].map((t,i)=><div key={t}><Layers size={18}/><b>0{i+1}</b><span>{t}</span></div>)}</div></div></Window>
    <div className="pw-assets pw-layer pw-layer-mid"><Image/><small>DIGITAL ASSETS</small><div className="pw-asset-tiles"><i/><i/><i/></div><strong>Shared content</strong><span>Images · Documents · Fragments</span></div>
    <Window title="BANKING / PUBLISHED PAGE" className="pw-bank pw-layer pw-layer-front"><div className="pw-bank-nav"><i/><b>Everyday banking</b></div><div className="pw-bank-hero"><span>BUILT AROUND YOU</span><strong>More possibilities.<br/>One place.</strong><div className="pw-bank-orb"/></div><div className="pw-bank-products"><span>Personal</span><span>Business</span><span>Insights</span></div><div className="pw-bank-bottom"><Check size={12}/> Shared components · Consistent pages</div></Window>
  </>;
  if(index === 3) return <>
    <div className="pw-panorama pw-layer pw-layer-back"><div className="pw-sun"/><div className="pw-mountain pw-mountain-one"/><div className="pw-mountain pw-mountain-two"/><div className="pw-mountain pw-mountain-three"/><div className="pw-lake"/><span>VIETNAM / A NEW PERSPECTIVE</span></div>
    <div className="pw-globe-orbit pw-layer pw-layer-mid"><i/><i/><Globe2/><span>360°</span></div>
    <Window title="BROWSER / EXPLORER" className="pw-explorer pw-layer pw-layer-front"><div><Navigation/><span>EXPLORE THE LANDSCAPE</span><strong>Around every corner,<br/>another story.</strong><div className="pw-viewpoints"><span><MapPin/> Landscape</span><span><MapPin/> Culture</span><span><MapPin/> Discovery</span></div></div></Window>
    <span className="pw-location pw-location-one"><MapPin/>01</span><span className="pw-location pw-location-two"><MapPin/>02</span>
  </>;
  if(index === 4) return <>
    <Window title="OPEN UNIVERSITY / OPENLEARN" className="pw-layer pw-layer-back"><div className="pw-campus"><GraduationCap/><small>OPEN TO CURIOSITY</small><strong>Your next chapter<br/>starts here.</strong><div className="pw-course-grid">{['Explore','Discover','Learn'].map(t=><div key={t}><BookOpen/><span>{t}</span><i/></div>)}</div></div></Window>
    <div className="pw-migration pw-layer pw-layer-mid"><Layers/><span>PLATFORM TRANSITION</span><strong>Drupal <ArrowRight/> Moodle</strong><small>Adapted frontend functionality</small></div>
    <div className="pw-lesson pw-layer pw-layer-front"><div className="pw-lesson-cover"><BookOpen/><span>INTERACTIVE LEARNING</span><strong>A space<br/>for every mind.</strong></div><div className="pw-lesson-body"><Accessibility/><strong>Inclusive by design</strong><MiniRows items={['Clear navigation','Responsive modules','Accessible interaction']}/></div></div>
  </>;
  return <>
    <Window title="SOCOTEC / WEB WORKSPACE" className="pw-layer pw-layer-back"><div className="pw-workspace"><Monitor/><span>CONNECTED INTERFACES</span><strong>From web<br/>to mobile.</strong><div className="pw-workspace-grid"><div/><div/><div/></div><MiniRows items={['Reusable modules','Responsive components']}/></div></Window>
    <Chip className="pw-layer pw-layer-mid" icon={<Cloud/>} title="INTEGRATION">Umbraco CMS<div className="pw-integration-tags"><span>PostgreSQL</span><span>Docker</span></div><b>BACKEND COLLABORATION</b></Chip>
    <div className="pw-phone pw-layer pw-layer-front"><i className="pw-notch"/><Smartphone/><small>FLIPLET / MOBILE</small><strong>Connected.<br/>Wherever.</strong><div className="pw-phone-picture"><Box/></div><MiniRows items={['Shared experience','Interface updates','Web integration']}/><b className="pw-ui-button">Explore <ArrowRight size={12}/></b></div>
  </>;
}

export function ProjectSculpture({ index, discipline, active = true }: {index: number; discipline: string; active?: boolean}) {
  const study = STUDIES[index];
  const [step, setStep] = useState(0);
  const [exploded, setExploded] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const raf = useRef(0);
  const pointer = useRef({x: 0, y: 0});
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    let visible = false;
    const sync = () => { el.dataset.running = String(active && visible && !document.hidden && !motion.matches); };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    observer.observe(el);
    motion.addEventListener('change', sync);
    document.addEventListener('visibilitychange', sync);
    sync();
    return () => { observer.disconnect(); motion.removeEventListener('change', sync); document.removeEventListener('visibilitychange', sync); cancelAnimationFrame(raf.current); raf.current = 0; };
  }, [active]);
  const resetTilt = () => { cancelAnimationFrame(raf.current); raf.current = 0; stage.current?.style.setProperty('--tilt-x', '0deg'); stage.current?.style.setProperty('--tilt-y', '0deg'); };
  const detailId = `project-world-detail-${index}`;
  return <div ref={root} className={`reality-sculpture reality-sculpture-${index} project-world`} data-world={index} data-step={step} data-exploded={exploded} data-running="false" style={{'--world-accent': study.color} as CSSProperties}>
    <header className="pw-heading"><span><i/> INTERACTIVE PROJECT STUDY</span><span>0{index+1} / 06</span></header>
    <div className="pw-intro"><span>{study.subtitle}</span><h4>{study.title}</h4></div>
    <div className="pw-viewport" onPointerMove={event=>{
      if(event.pointerType !== 'mouse' || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const rect = event.currentTarget.getBoundingClientRect();
      pointer.current = {x: (event.clientX - rect.left)/rect.width - .5, y: (event.clientY - rect.top)/rect.height - .5};
      if(raf.current) return;
      raf.current = requestAnimationFrame(()=> { stage.current?.style.setProperty('--tilt-x', `${-pointer.current.y * 9}deg`); stage.current?.style.setProperty('--tilt-y', `${pointer.current.x * 12}deg`); raf.current = 0; });
    }} onPointerLeave={resetTilt} aria-hidden="true">
      <div className="pw-ambient"/><div className="pw-grid-floor"/>
      <div ref={stage} className="pw-stage"><div className="pw-plinth"/><div className="pw-connector"><i/><i/><i/></div><World index={index}/></div>
      <span className="pw-scene-label">{discipline}</span>
    </div>
    <div className="pw-toolbar"><span><Move3D size={14}/> <span className="pw-mouse-hint">Move to explore · </span>Select a layer below</span><button type="button" aria-pressed={exploded} onClick={()=>setExploded(!exploded)}><Layers size={14}/>{exploded ? 'Assembled' : 'Separate layers'}</button><button type="button" aria-label="Reset project view" onClick={()=>{setExploded(false);setStep(0);resetTilt();}}><RotateCcw size={14}/></button></div>
    <div className="pw-step-controls" role="group" aria-label={`${study.subtitle} layers`}>{study.steps.map(([title],i)=><button type="button" key={title} aria-pressed={step===i} aria-controls={detailId} onClick={()=>setStep(i)}><span>0{i+1}</span><strong>{title}</strong></button>)}</div>
    <div id={detailId} className="pw-detail" aria-live="polite" aria-atomic="true"><span>{study.steps[step][1]}</span><p>{study.steps[step][2]}</p></div>
    <footer className="pw-footnote">Concept model · Illustrates my contribution, not a production screenshot.</footer>
  </div>;
}

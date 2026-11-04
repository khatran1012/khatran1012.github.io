import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  ExternalLink,
  Building2,
  X,
  CheckCircle2,
  ArrowUpRight,
} from 'lucide-react';
import { PROJECTS, Project } from '../data/cvData';
import { ProjectPreview } from './ProjectPreview';
import { ProjectSculpture } from './ProjectSculpture';
import './built-in-reality.css';

// Keep the user's requested project selection consistent in the page and case links.
const EXCLUDED_PROJECTS = new Set(['oness-fmcg', 'shopify-custom-cms', 'aoste-food']);
const VISIBLE_PROJECTS = PROJECTS.filter(project => !EXCLUDED_PROJECTS.has(project.id));
const CASE_HISTORY_KEY = 'ktCaseStudy';
const PROJECT_EDITIONS: Record<string, { label: string; discipline: string; short: string }> = {
  'theme-park-iot': { label: 'Beyond the browser.', discipline: 'SERVICES × PHYSICAL EDGE', short: 'Theme Park & IoT' },
  'marina-bay-sands': { label: 'From discovery to checkout.', discipline: 'COMMERCE × EXPERIENCE', short: 'Marina Bay Sands' },
  'techcombank-portal': { label: 'A system for every story.', discipline: 'CONTENT × COMPONENTS', short: 'Techcombank' },
  'nashtech-virtual-vietnam': { label: 'A different point of view.', discipline: 'IMMERSIVE × WEB', short: 'Virtual Vietnam' },
  'open-university-uk': { label: 'Learning, without barriers.', discipline: 'EDUCATION × ACCESSIBILITY', short: 'Open University' },
  'socotec-platform': { label: 'Connected, on every screen.', discipline: 'WEB × MOBILE INTEGRATION', short: 'Socotec' },
};

export const BuiltInReality: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeProject, setActiveProject] = useState(0);
  const historyOwner = useRef('');
  const closingHistory = useRef(false);
  const selectedProjectRef = useRef(selectedProject);
  selectedProjectRef.current = selectedProject;

  useEffect(() => {
    // A marker from an earlier page load must not make a direct link navigate away on close.
    historyOwner.current ||= `${Date.now()}-${Math.random()}`;
    let scrollFrame = 0;
    const syncLocation = () => {
      closingHistory.current = false;
      const url = new URL(window.location.href);
      const projectId = url.searchParams.get('case');
      const project = VISIBLE_PROJECTS.find(item => item.id === projectId) || null;
      setSelectedProject(project);
      const chapter = url.hash.slice(1);
      const linkedProject = VISIBLE_PROJECTS.find(item => chapter === 'reality-project-' + item.id || chapter === 'reality-archive-' + item.id);
      const index = VISIBLE_PROJECTS.findIndex(item => item.id === (project?.id || linkedProject?.id));
      if (index >= 0) setActiveProject(index);
      if (chapter === 'more-projects' || chapter === 'project-selector' || linkedProject) {
        if (chapter === 'more-projects' || chapter.startsWith('reality-archive-')) {
          url.hash = linkedProject ? 'reality-project-' + linkedProject.id : 'project-selector';
          window.history.replaceState(window.history.state, '', url);
        }
        // Wait for the selected radio and its panel to update before positioning the showcase.
        cancelAnimationFrame(scrollFrame);
        scrollFrame = requestAnimationFrame(() => {
          document.getElementById('project-selector')?.scrollIntoView({ behavior: 'instant' });
        });
      }
    };
    syncLocation();
    window.addEventListener('popstate', syncLocation);
    window.addEventListener('hashchange', syncLocation);
    return () => {
      cancelAnimationFrame(scrollFrame);
      window.removeEventListener('popstate', syncLocation);
      window.removeEventListener('hashchange', syncLocation);
    };
  }, []);

  const openCaseStudy = (project: Project) => {
    const url = new URL(window.location.href);
    if (url.searchParams.get('case') !== project.id) {
      url.searchParams.set('case', project.id);
      const state = window.history.state;
      window.history.pushState({
        ...(state && typeof state === 'object' ? state : {}),
        [CASE_HISTORY_KEY]: { owner: historyOwner.current, url: url.href },
      }, '', url);
    }
    setActiveProject(VISIBLE_PROJECTS.indexOf(project));
    setSelectedProject(project);
  };

  const closeCaseStudy = () => {
    if (closingHistory.current) return;
    const entry = window.history.state?.[CASE_HISTORY_KEY];
    if (entry?.owner === historyOwner.current && entry.url === window.location.href) {
      closingHistory.current = true;
      window.history.back();
      return;
    }
    const url = new URL(window.location.href);
    url.searchParams.delete('case');
    const state = window.history.state;
    const nextState = state && typeof state === 'object' ? { ...state } : state;
    if (nextState && typeof nextState === 'object') delete nextState[CASE_HISTORY_KEY];
    window.history.replaceState(nextState, '', url);
    setSelectedProject(null);
  };

  const caseStudyRef = useRef<HTMLDialogElement>(null);
  const restorePage = useRef<(() => void) | null>(null);
  const reducedMotion = useReducedMotion();
  const finishClose = () => {
    if (selectedProjectRef.current) return;
    restorePage.current?.();
    restorePage.current = null;
  };
  useEffect(() => () => { restorePage.current?.(); }, []);

  useEffect(() => {
    if (!selectedProject || !caseStudyRef.current) return;
    if (caseStudyRef.current.open) return;
    const dialog = caseStudyRef.current;
    const previousOverflow = document.body.style.overflow;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const scrollPosition = { top: window.scrollY, left: window.scrollX };
    restorePage.current = () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      opener?.focus({ preventScroll: true });
      window.scrollTo({ ...scrollPosition, behavior: 'instant' });
    };
    dialog.showModal();
    document.body.style.overflow = 'hidden';
  }, [selectedProject]);

  // Exhibition narrative data matching Kha Tran's exact projects
  const EXHIBITION_STORIES: Record<
    string,
    {
      problem: string;
      architecture: string;
      ownership: string;
      tradeoffs: string;
      results: string;
    }
  > = {
    'theme-park-iot': {
      problem:
        'Ticket orders, shared inventory, and physical gate scans must stay consistent under concurrent use. Entry gates also need local operation when the central network is unavailable.',
      architecture:
        'Hybrid Golang microservices (Gin, SQLC, PostgreSQL) combined with an autonomous on-premise Linux Edge Gateway. MQTT broker manages bidirectional telemetry. Redis distributed mutexes and PostgreSQL row-level locks (SELECT FOR UPDATE) serialize validations.',
      ownership:
        'My implementation scope: Golang backend services, edge caching and synchronization, and OTA-facing API endpoints. The architecture above describes the wider platform; delivery also involved frontend, infrastructure, and product teammates.',
      tradeoffs:
        'Local caching supports gate operation during network loss, with delayed synchronization after reconnection. Database transactions and locks protect central state, while disconnected gateways still need a clear reconciliation and duplicate-admission policy.',
      results:
        'Implemented offline validation and deferred synchronization. Production uptime, gate latency, and cross-gateway duplicate rates are not benchmarked in this portfolio.',
    },
    'marina-bay-sands': {
      problem:
        'Attraction discovery, cart state, authentication, and payment needed to work together across desktop and mobile ticket-purchasing journeys.',
      architecture:
        'React and Next.js interfaces with SSR/SSG, Redux state, REST and payment integrations, and React Native Web PWA work across web and mobile experiences.',
      ownership:
        'Developed end-to-end e-commerce purchasing flows, worked on rendering performance and technical SEO, and integrated localized payment gateways.',
      tradeoffs:
        'SSR/SSG makes public content available in the initial response, while client-side state handles carts and other interactive workflows. Rendering choices still need to account for content freshness and integration behavior.',
      results:
        'Delivered purchasing interfaces across desktop and mobile. No public LCP or conversion benchmark is included here.',
    },
    'techcombank-portal': {
      problem:
        'Banking content authors needed reusable page modules, a consistent authoring structure, accessible interactions, and organized digital assets within Adobe Experience Manager.',
      architecture:
        'Adobe Experience Manager (AEM) modular architecture. Custom component framework using Vanilla JavaScript to bypass heavy client-side runtime overhead.',
      ownership:
        'Customized and maintained modular AEM components, improved accessibility against WCAG guidance, and managed enterprise digital financial asset pipelines.',
      tradeoffs:
        'Reusable AEM components fit the existing authoring workflow. Lightweight JavaScript keeps component behavior focused, while shared templates require coordination between content authors, designers, and developers.',
      results:
        'Delivered reusable banking content components and accessibility improvements. Formal WCAG certification and publishing-time measurements are not provided here.',
    },
    'nashtech-virtual-vietnam': {
      problem:
        'Needed an innovative, interactive 3D corporate showcase to present Vietnam’s cultural and technological landscape without requiring heavy app store downloads.',
      architecture:
        'JavaScript and Three.js for the 3D/360° experience, alongside reusable React and Tailwind CSS modules for corporate web content.',
      ownership:
        'Developed the Three.js 3D/360° experience, built and maintained frontend modules, and collaborated with backend, product, and marketing teams on delivery and technical SEO.',
      tradeoffs:
        'Browser-based 3D avoids an app-install step but adds graphics and asset costs. Interaction detail needs to be balanced with readable page content and the devices visitors use.',
      results:
        'Delivered a browser-based interactive showcase. Device-specific FPS measurements are not included here.',
    },
    'open-university-uk': {
      problem:
        'The university homepage and online learning tools needed accessible, consistent interfaces while learning-platform functionality moved from Drupal to Moodle.',
      ownership:
        'Built and maintained frontend modules with Vanilla JavaScript, jQuery, and Bootstrap. Integrated those interfaces with Drupal, adapted functionality for Moodle, and implemented accessibility improvements informed by WCAG guidance.',
      architecture:
        'Reusable frontend modules connected the university homepage and interactive learning tools to the existing PHP-based Drupal and Moodle platforms. Interface work covered navigation, responsive presentation, and accessible interaction.',
      tradeoffs:
        'Working within the existing CMS and LMS keeps the interface aligned with their authoring and learning workflows. A platform transition also requires adapting frontend behavior to each system without losing usability or accessibility.',
      results:
        'Delivered homepage and learning-tool interfaces, plus frontend changes supporting the Drupal-to-Moodle transition. The responsibilities listed below describe my contribution; this portfolio does not claim formal WCAG certification or a measured learning outcome.',
    },
    'socotec-platform': {
      problem:
        'The connected web frontend and Fliplet-based mobile application needed consistent, responsive interfaces as components and integrations changed.',
      ownership:
        'Built and maintained Vanilla JavaScript, jQuery, and Bootstrap 4 modules, implemented interface updates, and improved component usability. Collaborated with backend teams working with Umbraco CMS, Docker, PostgreSQL, and the Fliplet engine.',
      architecture:
        'Web frontend modules connected to the existing content and application services alongside a Fliplet-based mobile application. My work focused on interface behavior and integration with the backend teams, rather than ownership of the entire backend platform.',
      tradeoffs:
        'Using the existing web stack and Fliplet platform preserves established delivery workflows. Shared behavior and interface changes still need coordination across the web, mobile, and backend boundaries.',
      results:
        'Delivered responsive web modules, component-usability improvements, and mobile integration updates. The responsibilities below describe that delivery scope; no public usability study or performance benchmark is included here.',
    },
  };

  return (
    <section id="reality" className="section section-alt reality-section">
      <div className="container">
        {/* Section Header */}
        <div className="reality-section-heading">
          <div className="chapter-badge">
            <Building2 size={13} />
            <span>CHAPTER 02 // BUILT IN REALITY</span>
          </div>
          <h2 className="chapter-title">
            Selected work.<br /><span className="accent-patina">Real-world constraints.</span>
          </h2>
          <p className="chapter-desc">
            {VISIBLE_PROJECTS.length} projects across interfaces, services, education, and the physical edge.
            The problem, my contribution, and what shipped—followed by the decisions behind it.
          </p>
        </div>

        <div className="reality-showcase" aria-label="Selected project showcase">
          <fieldset id="project-selector" className="reality-project-index">
            <legend>SELECT A PROJECT <span>01 — {String(VISIBLE_PROJECTS.length).padStart(2, '0')} / CASE STUDIES</span></legend>
            {VISIBLE_PROJECTS.map((project, index) => {
              return <label key={project.id} className="reality-project-choice">
                <input type="radio" name="reality-project" id={'reality-choice-' + index} value={index}
                  checked={activeProject === index} onChange={() => setActiveProject(index)}
                  aria-controls={'reality-project-' + project.id} />
                <span className="reality-project-choice-surface"><span className="reality-choice-number">0{index + 1}</span><span className="reality-choice-copy"><strong>{PROJECT_EDITIONS[project.id].short}</strong><span>{PROJECT_EDITIONS[project.id].discipline}</span></span></span>
              </label>;
            })}
          </fieldset>
          <div className="reality-project-stage">
            {VISIBLE_PROJECTS.map((project, index) => {
              const story = EXHIBITION_STORIES[project.id];
              return <article key={project.id} id={'reality-project-' + project.id} data-cv-project={project.id} className={'reality-project-panel reality-project-panel-' + index} aria-labelledby={'reality-title-' + project.id}>
                <div className="reality-project-copy">
                  <div className="reality-project-meta"><span>SELECTED WORK / 0{index + 1}</span><span>{project.period}</span></div>
                  <p className="reality-company">{project.company}</p>
                  <h3 id={'reality-title-' + project.id}>{project.title}</h3>
                  <p className="reality-project-subtitle">{project.subtitle}</p>
                  <dl className="reality-project-story">
                    <div><dt><span>01</span> Problem</dt><dd>{project.caseSummary?.problem || story?.problem || project.description}</dd></div>
                    <div><dt><span>02</span> My Solution</dt><dd>{project.caseSummary?.action || story?.ownership || project.highlights[0]}</dd></div>
                    <div className="reality-shipped"><dt><span>03</span> Outcome</dt><dd>{project.caseSummary?.result || story?.results || project.description}</dd></div>
                  </dl>
                  <div className="reality-project-technologies" aria-label="Project technologies">{project.technologies.slice(0, 4).map(technology => <span key={technology}>{technology}</span>)}{project.technologies.length > 4 && <span>+{project.technologies.length - 4} in case study</span>}</div>
                  <details className="reality-project-responsibilities"><summary>All responsibilities in the CV <span>{project.highlights.length}</span></summary><ul>{project.highlights.map(highlight => <li key={highlight}>{highlight}</li>)}</ul></details>
                  <div className="reality-project-actions"><button type="button" onClick={() => openCaseStudy(project)} className="reality-case-button" aria-haspopup="dialog">Read case study<span><ArrowUpRight size={18} /></span></button>{project.sourceUrl && <a href={project.sourceUrl} target="_blank" rel="noopener noreferrer">Source code<ExternalLink size={13} /></a>}{project.domain && <a href={project.domain} target="_blank" rel="noopener noreferrer" title="Visit project website (opens in a new tab)">Visit website<ExternalLink size={13} /></a>}{project.relatedLinks?.map(link => <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer">{link.label}<ExternalLink size={13} /></a>)}</div>
                </div>
                <div className="reality-project-art"><div className="reality-art-heading"><span>THE PROJECT, IN PERSPECTIVE</span><span>↗</span></div><ProjectSculpture index={index} discipline={PROJECT_EDITIONS[project.id].discipline} /><p className="reality-art-statement">{PROJECT_EDITIONS[project.id].label}</p></div>
              </article>;
            })}
          </div>
        </div>
        <p className="reality-project-footnote"><span>{VISIBLE_PROJECTS.length} PROJECTS. ONE ENGINEERING PRACTICE.</span><span>Concept illustrations. Read the full contribution and technologies in each case study.</span></p>

        {/* Interactive Case Study Modal */}
        <AnimatePresence onExitComplete={finishClose}>
          {selectedProject && (
            <motion.dialog
              ref={caseStudyRef}
              aria-labelledby="case-study-title"
              aria-modal="true"
              onCancel={(event) => { event.preventDefault(); closeCaseStudy(); }}
              onKeyDown={(event) => {
                if (event.key !== 'Tab') return;
                const controls = event.currentTarget.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex="0"]');
                const first = controls[0];
                const last = controls[controls.length - 1];
                if (event.shiftKey && document.activeElement === first) {
                  event.preventDefault();
                  last?.focus();
                } else if (!event.shiftKey && document.activeElement === last) {
                  event.preventDefault();
                  first?.focus();
                }
              }}
              className="case-study-dialog"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reducedMotion ? 0 : 0.18, ease: 'easeOut' }}
              style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(5, 7, 9, 0.88)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 100,
                padding: '1.5rem',
              }}
              onClick={(event) => {
                if (event.target === event.currentTarget) closeCaseStudy();
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: reducedMotion ? 0 : 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reducedMotion ? 0 : 8 }}
                transition={{ duration: reducedMotion ? 0 : 0.18, ease: 'easeOut' }}
                onClick={(e) => e.stopPropagation()}
                className="arch-slab"
                style={{
                  maxWidth: '780px',
                  width: '100%',
                  maxHeight: '90vh',
                  overflowY: 'auto',
                  padding: '2.5rem',
                  borderColor: 'var(--copper-patina-border)',
                }}
              >
                {/* Modal Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem' }}>
                  <div>
                    <span className="arch-tag patina" style={{ marginBottom: '0.5rem' }}>
                      CASE STUDY // {selectedProject.company?.toUpperCase()}
                    </span>
                    <h3 id="case-study-title" style={{ fontFamily: 'var(--font-editorial)', fontSize: '1.8rem', color: 'var(--text-ivory)' }}>
                      {selectedProject.title}
                    </h3>
                  </div>
                  <button
                    onClick={closeCaseStudy}
                    style={{
                      background: 'transparent',
                      border: '1px solid var(--border-arch)',
                      color: 'var(--text-ivory)',
                      borderRadius: 'var(--radius-xs)',
                      width: '36px',
                      height: '36px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                    aria-label="Close Case Study"
                  >
                    <X size={18} />
                  </button>
                </div>

                {selectedProject.previewImage && <div className="case-study-visual">
                  <ProjectPreview project={selectedProject} />
                  <p>Illustrative engineering context. My delivery scope is described in “My Role” below.</p>
                </div>}

                {/* Narrative Sections */}
                {(() => {
                  const s = EXHIBITION_STORIES[selectedProject.id];
                  if (!s) return <div className="reality-cv-detail">
                    <p className="reality-cv-subtitle">{selectedProject.subtitle}</p>
                    <h4>Project overview</h4><p>{selectedProject.description}</p>
                    {selectedProject.caseSummary && <><h4>My contribution</h4><p>{selectedProject.caseSummary.action}</p><h4>Delivered</h4><p>{selectedProject.caseSummary.result}</p></>}
                  </div>;
                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
                      <div style={{ padding: '1.25rem', background: 'var(--bg-canvas)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-arch)' }}>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--copper-patina)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                          01 // Problem
                        </div>
                        <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{s.problem}</p>
                      </div>

                      <div style={{ padding: '1.25rem', background: 'var(--bg-canvas)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-arch)' }}>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--copper-warm-bright)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                          02 // My Role
                        </div>
                        <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{s.ownership}</p>
                      </div>

                      <div style={{ padding: '1.25rem', background: 'var(--bg-canvas)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-arch)' }}>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--copper-patina)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                          03 // Solution
                        </div>
                        <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{s.architecture}</p>
                      </div>

                      <div style={{ padding: '1.25rem', background: 'var(--copper-warm-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--copper-warm-border)' }}>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--copper-warm-bright)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                          04 // Trade-offs
                        </div>
                        <p style={{ fontSize: '0.92rem', color: 'var(--text-ivory)', lineHeight: 1.6 }}>{s.tradeoffs}</p>
                      </div>

                      <div style={{ padding: '1.25rem', background: 'var(--copper-patina-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--copper-patina-border)' }}>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--copper-patina)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                          05 // Outcome &amp; Evidence
                        </div>
                        <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-ivory)', lineHeight: 1.6 }}>{s.results}</p>
                      </div>
                    </div>
                  );
                })()}

                <section className="reality-cv-detail" aria-label="Full responsibilities from the CV">
                  <h4>Responsibilities in my CV</h4>
                  <ul>{selectedProject.highlights.map(highlight => <li key={highlight}>{highlight}</li>)}</ul>
                </section>

                {/* Technologies List */}
                <div style={{ marginBottom: '2rem' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    Technologies used:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {selectedProject.technologies.map((t) => (
                      <span key={t} className="arch-tag">
                        <CheckCircle2 size={12} color="var(--copper-patina)" />
                        <span>{t}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {(selectedProject.domain || selectedProject.sourceUrl || selectedProject.relatedLinks?.length) ? <div className="reality-project-actions reality-case-links">
                  {selectedProject.domain && <a href={selectedProject.domain} target="_blank" rel="noopener noreferrer">Visit project website<ExternalLink size={14} /></a>}
                  {selectedProject.sourceUrl && <a href={selectedProject.sourceUrl} target="_blank" rel="noopener noreferrer">Source code<ExternalLink size={14} /></a>}
                  {selectedProject.relatedLinks?.map(link => <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer">{link.label}<ExternalLink size={14} /></a>)}
                </div> : null}

                {/* Close Button */}
                <button
                  onClick={closeCaseStudy}
                  className="btn-arch btn-arch-patina"
                  style={{ width: '100%', padding: '0.75rem' }}
                >
                  Close Case Study
                </button>
              </motion.div>
            </motion.dialog>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

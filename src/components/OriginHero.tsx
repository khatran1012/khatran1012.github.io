import React from 'react';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { PERSONAL_INFO } from '../data/cvData';
import { SculptureCanvas } from './canvas/SculptureCanvas';
import { CareerArchive } from './CareerArchive/CareerArchive';
import { EngineeringBento } from './EngineeringBento';
import { CopyEmailButton } from './CopyEmailButton';

export const OriginHero: React.FC = () => {
  return (
    <section id="origin" className="section hero-section" style={{ minHeight: '92vh', display: 'flex', alignItems: 'center', paddingTop: '6rem' }}>
      <div className="container" style={{ width: '100%' }}>
        <div className="hero-exhibit-grid">
          {/* Left Column: Manifesto & Narrative */}
          <div className="hero-copy">
            {/* Exhibition Badge */}
            <div className="chapter-badge">
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--copper-patina)' }} />
              <span>CHAPTER 01 // THE ORIGIN</span>
            </div>

            <div className="candidate-identity">
              <p>{PERSONAL_INFO.name}</p>
              <p className="native-name" lang="vi">{PERSONAL_INFO.fullName}</p>
              <span>Software Engineer</span>
            </div>

            {/* Exhibition Monolithic Title */}
            <h1
              className="chapter-title"
              style={{
                fontSize: 'clamp(2.3rem, 4.4vw, 3.3rem)',
                lineHeight: 1.08,
                letterSpacing: '-0.04em',
                marginBottom: '1rem',
              }}
            >
              Thoughtful interfaces.<br />
              <span className="accent-patina">Resilient systems.</span>
            </h1>

            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.95rem',
                color: 'var(--copper-warm-bright)',
                marginBottom: '1.5rem',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              React / TypeScript · Golang · Offline-first IoT
            </div>

            {/* Core Manifesto - Not long clichés, but deep engineering philosophy */}
            <div
              style={{
                borderLeft: '2px solid var(--copper-patina)',
                paddingLeft: '1.25rem',
                marginBottom: '2rem',
                fontFamily: 'var(--font-body)',
                fontSize: '1.08rem',
                lineHeight: 1.7,
                color: 'var(--text-secondary)',
              }}
            >
              <p style={{ color: 'var(--text-ivory)', fontWeight: 600, marginBottom: '0.5rem' }}>
                I turn complex workflows into clear interfaces and dependable services.
              </p>
              <p>
                I’m Kha, a software engineer in Ho Chi Minh City. My work spans enterprise
                frontends, transactional ticketing, and edge gateways that keep working through network interruptions.
              </p>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <a href="#reality" className="btn-arch btn-arch-patina">
                <span>Explore My Work</span>
                <ArrowDown size={17} />
              </a>
              <a
                href={PERSONAL_INFO.cvPdfUrl}
                target="_blank" rel="noopener noreferrer"
                className="btn-arch btn-arch-outline"
              >
                <span>View CV (PDF)</span>
                <ArrowUpRight size={17} />
              </a>
              <CopyEmailButton />
            </div>
          </div>

          {/* Right Column: Cybernetic System Architecture Exhibit */}
          <div className="hero-exhibit-column">
            <SculptureCanvas />
          </div>
        </div>
        <EngineeringBento />
        <CareerArchive />
      </div>
    </section>
  );
};

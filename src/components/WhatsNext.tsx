import { ArrowUpRight, Compass, Mail, Phone } from 'lucide-react';
import { PERSONAL_INFO } from '../data/cvData';
import { GithubIcon, LinkedinIcon } from './Icons';
import { CopyEmailButton } from './CopyEmailButton';

export const WhatsNext = () => (
  <section id="next" className="section">
    <div className="container" style={{ maxWidth: '980px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div className="chapter-badge warm"><Compass size={13} /><span>CHAPTER 05 // WHAT’S NEXT?</span></div>
        <h2 className="chapter-title">Let’s build<br /><span className="accent-copper">something that lasts.</span></h2>
        <p className="chapter-desc">A thoughtful interface. A dependable service. A system that keeps working when conditions change.</p>
      </div>
      <div className="arch-slab" style={{ padding: 'clamp(1.25rem, 4vw, 2.5rem)', borderColor: 'var(--copper-patina-border)' }}>
        <div className="contact-heading">
          <p className="availability-badge">Open to full-time engineering opportunities</p>
          <h3>Your next challenge, built with care.</h3>
          <p>I work across React and TypeScript interfaces, Golang services, and offline-first gateways. If that fits your team or product, let’s talk.</p>
        </div>
        <div className="contact-actions">
          <CopyEmailButton />
          <a href={PERSONAL_INFO.cvPdfUrl} target="_blank" rel="noopener noreferrer" className="btn-arch btn-arch-patina">View CV (PDF)<ArrowUpRight size={17} /></a>
          <a href={'mailto:' + PERSONAL_INFO.email} className="btn-arch btn-arch-outline"><Mail size={16} />Send an email</a>
        </div>
        <div className="contact-links">
          <a href={'mailto:' + PERSONAL_INFO.email}><Mail size={15} />{PERSONAL_INFO.email}</a>
          <a href={'tel:' + PERSONAL_INFO.phone}><Phone size={15} />{PERSONAL_INFO.displayPhone}</a>
          <a href={PERSONAL_INFO.linkedin} target="_blank" rel="noopener noreferrer"><LinkedinIcon size={15} />LinkedIn<ArrowUpRight size={13} /></a>
          <a href={PERSONAL_INFO.github} target="_blank" rel="noopener noreferrer"><GithubIcon size={15} />GitHub<ArrowUpRight size={13} /></a>
        </div>
      </div>
    </div>
  </section>
);

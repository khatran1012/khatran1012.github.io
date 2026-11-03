import { ArrowUpRight, Braces, GitBranch, Server, Sparkles } from 'lucide-react';

export function EngineeringBento() {
  return <section className="expertise-section" aria-labelledby="expertise-title">
    <div className="expertise-heading">
      <div><span className="eyebrow">THE WAY I BUILD</span><h2 id="expertise-title">Care in every layer.</h2></div>
      <a href="#reality">See it in practice <ArrowUpRight size={16} /></a>
    </div>
    <div className="expertise-bento">
      <article className="arch-slab bento-philosophy">
        <Sparkles size={22} aria-hidden="true" />
        <span className="eyebrow">01 / PHILOSOPHY</span>
        <h3>A good interface earns its speed.</h3>
        <p>I connect clear UI states, accessible interactions, and reliable services so the experience holds together when the network does not.</p>
        <span className="bento-note">From the browser to the physical edge.</span>
      </article>
      <article className="arch-slab bento-frontend">
        <Braces size={21} aria-hidden="true" /><span className="eyebrow">02 / INTERFACES</span>
        <h3>Clear, responsive, reusable.</h3>
        <p>Product portals, commerce flows, and enterprise components built around real user tasks.</p>
        <div className="bento-stack">React · TypeScript · Next.js · Angular · A11y</div>
      </article>
      <article className="arch-slab">
        <Server size={21} aria-hidden="true" /><span className="eyebrow">03 / SYSTEMS</span>
        <h3>Built for real conditions.</h3>
        <p>Transactional ticketing, API boundaries, and offline-first device synchronization.</p>
        <div className="bento-stack">Golang · PostgreSQL · Redis · MQTT</div>
      </article>
      <article className="arch-slab">
        <GitBranch size={21} aria-hidden="true" /><span className="eyebrow">04 / WORKFLOW</span>
        <h3>Shared decisions. Clear ownership.</h3>
        <p>Work with design, backend, and product teams to make trade-offs explicit and keep delivery maintainable.</p>
        <div className="bento-stack">Git · Scrum · Jira · Azure DevOps</div>
      </article>
    </div>
  </section>;
}

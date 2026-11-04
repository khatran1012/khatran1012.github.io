import React, { memo, useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { OriginHero } from './components/OriginHero';
import { SystemAnatomy } from './components/SystemAnatomy';
import { PressureSimulations } from './components/PressureSimulations';
import { BuiltInReality } from './components/BuiltInReality';
import { WhatsNext } from './components/WhatsNext';
import { ExhibitionFooter } from './components/ExhibitionFooter';

// Theme colors inherit from CSS. These chapters do not need a second render
// when the saved theme is restored or the header switches it.
const MemoOriginHero = memo(OriginHero);
const MemoBuiltInReality = memo(BuiltInReality);
const MemoPressureSimulations = memo(PressureSimulations);
const MemoWhatsNext = memo(WhatsNext);
const MemoExhibitionFooter = memo(ExhibitionFooter);

export const App: React.FC = () => {
  // The first client render must match the generated HTML in either theme.
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [themeReady, setThemeReady] = useState(false);

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');
    setThemeReady(true);
  }, []);

  useEffect(() => {
    if (!themeReady) return;
    if (document.documentElement.dataset.theme !== theme) {
      document.documentElement.setAttribute('data-theme', theme);
    }
    try {
      localStorage.setItem('kt-exhibition-theme', theme);
    } catch {
      // Theme switching still works when browser storage is unavailable.
    }
  }, [theme, themeReady]);

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const sections = document.querySelectorAll('main > section, .cyber-exhibit');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.target.classList.toggle('is-offscreen', !entry.isIntersecting));
    }, { rootMargin: '80px' });
    sections.forEach((section) => observer.observe(section));
    const updateVisibility = () => {
      document.documentElement.classList.toggle('page-hidden', document.hidden);
    };
    updateVisibility();
    document.addEventListener('visibilitychange', updateVisibility);
    return () => {
      observer.disconnect();
      sections.forEach((section) => section.classList.remove('is-offscreen'));
      document.removeEventListener('visibilitychange', updateVisibility);
      document.documentElement.classList.remove('page-hidden');
    };
  }, []);

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const blocks = document.querySelectorAll<HTMLElement>(
      '#main-content > section:not(#origin) > .container > :not(.artifacts-grid):not(.journey-track):not(dialog), .artifacts-grid > .arch-slab, .expertise-bento > .arch-slab, .career-snapshot',
    );
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('scroll-revealed');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px 64px 0px', threshold: 0 });

    // Read all positions before changing classes, avoiding a forced layout for
    // every block during hydration. Direct chapter links remain visible.
    const viewportHeight = window.innerHeight;
    const offscreen = Array.from(blocks).filter(block => block.getBoundingClientRect().top >= viewportHeight);
    offscreen.forEach((block) => {
      block.classList.add('scroll-reveal');
      observer.observe(block);
    });
    return () => {
      observer.disconnect();
      blocks.forEach((block) => block.classList.remove('scroll-reveal', 'scroll-revealed'));
    };
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="portfolio-app" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <main id="main-content" style={{ flex: 1 }}>
        {/* Chapter 01 — The Origin */}
        <MemoOriginHero />

        {/* Chapter 02 — Selected Work */}
        <MemoBuiltInReality />

        {/* Chapter 03 — Inside the System */}
        <SystemAnatomy theme={theme} />

        {/* Chapter 04 — Decisions Under Pressure */}
        <MemoPressureSimulations />

        {/* Chapter 05 — What's Next? */}
        <MemoWhatsNext />
      </main>
      <MemoExhibitionFooter />
    </div>
  );
};

export default App;

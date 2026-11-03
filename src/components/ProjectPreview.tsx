import { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import type { Project } from '../data/cvData';

export function ProjectPreview({ project }: { project: Project }) {
  const [playing, setPlaying] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  const base = import.meta.env.BASE_URL;
  useEffect(() => {
    if (!video.current) return;
    if (playing) video.current.play().catch(() => setPlaying(false));
    else video.current.pause();
  }, [playing]);
  useEffect(() => {
    if (!project.previewVideo) return;
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const stop = () => { if (preference.matches || document.hidden) setPlaying(false); };
    const observer = new IntersectionObserver(([entry]) => { if (!entry.isIntersecting) setPlaying(false); });
    if (video.current) observer.observe(video.current);
    preference.addEventListener('change', stop);
    document.addEventListener('visibilitychange', stop);
    return () => { observer.disconnect(); preference.removeEventListener('change', stop); document.removeEventListener('visibilitychange', stop); };
  }, [project.previewVideo]);
  if (!project.previewImage) return null;
  return <figure className="project-preview"
    onMouseEnter={() => { if (project.previewVideo && !matchMedia('(prefers-reduced-motion: reduce)').matches) setPlaying(true); }}
    onMouseLeave={() => setPlaying(false)}>
    <img src={`${base}${project.previewImage}`} alt={`Engineering illustration for ${project.title}`} width={1120} height={630} loading="lazy" decoding="async" />
    {project.previewVideo && <>
      <video ref={video} src={playing ? `${base}${project.previewVideo}` : undefined} poster={`${base}${project.previewImage}`} muted loop playsInline preload="none" aria-label={`${project.title} product walkthrough`} />
      <button className="project-video-toggle" type="button" aria-pressed={playing} onClick={() => setPlaying(value => !value)}>
        {playing ? <Pause size={14} /> : <Play size={14} />}{playing ? 'Pause preview' : 'Play preview'}
      </button>
    </>}
    <figcaption>{project.previewVideo ? 'PRODUCT WALKTHROUGH' : 'ENGINEERING ILLUSTRATION'}</figcaption>
  </figure>;
}

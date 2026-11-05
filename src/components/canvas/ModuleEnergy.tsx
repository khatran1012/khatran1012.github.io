import { useId } from 'react';
import type { SystemModuleId } from './systemModuleLayout';

const ORBITS = [
  { rx: 54, ry: 20, angle: -19, color: '#67edff' },
  { rx: 52, ry: 24, angle: 21, color: '#ffbd73' },
  { rx: 47, ry: 34, angle: -37, color: '#b8e8ff' },
];

export function ModuleEnergy({ id, rear = false }: { id: SystemModuleId; rear?: boolean }) {
  const gradientId = useId();

  if (id === 'core') {
    return (
      <svg className={`module-energy module-energy--orbit ${rear ? 'module-energy--rear' : ''}`} viewBox="0 0 100 100" aria-hidden="true">
        {ORBITS.map(({ rx, ry, angle, color }) => {
          const sweep = rear ? 1 : 0;
          const arc = `M${50 - rx} 47 A${rx} ${ry} 0 0 ${sweep} ${50 + rx} 47`;
          return (
            <g key={angle} transform={`rotate(${angle} 50 47)`} style={{ color }}>
              <path className="module-energy__haze" d={arc} />
              <path className="module-energy__line" d={arc} />
              <path className="module-energy__current" d={arc} pathLength="100" />
            </g>
          );
        })}
      </svg>
    );
  }

  if (rear) return <span className="module-energy module-energy--halo" aria-hidden="true" />;

  if (id === 'frontend') {
    return (
      <svg className="module-energy module-energy--field" viewBox="0 0 100 100" aria-hidden="true">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop stopColor="#93fff5" stopOpacity=".29" />
            <stop offset=".46" stopColor="#00f5d4" stopOpacity=".035" />
            <stop offset="1" stopColor="#63ddff" stopOpacity=".13" />
          </linearGradient>
        </defs>
        <path className="module-energy__field-shell" fill={`url(#${gradientId})`}
          d="M17 67 15 35 23 20 49 9 77 20 85 35 83 65 50 83Z" />
        <path className="module-energy__facet" d="M15 35 50 49 85 35 M23 20 50 32 77 20 M49 9 50 32 50 83 M17 67 50 52 83 65" />
        <path className="module-energy__facet module-energy__facet--scan" pathLength="100" d="M17 67 15 35 23 20 49 9 77 20 85 35 83 65 50 83Z" />
      </svg>
    );
  }

  if (id === 'data') {
    return (
      <svg className="module-energy module-energy--data" viewBox="0 0 100 100" aria-hidden="true">
        {[{ y: 44, angle: -15, color: '#67dcff' }, { y: 58, angle: 12, color: '#b491ff' }, { y: 68, angle: -5, color: '#a193ff' }].map(({ y, angle, color }) => (
          <g key={y} transform={`rotate(${angle} 50 ${y})`} style={{ color }}>
            <ellipse className="module-energy__haze" cx="50" cy={y} rx="36" ry="9" />
            <ellipse className="module-energy__current" cx="50" cy={y} rx="36" ry="9" pathLength="100" />
          </g>
        ))}
      </svg>
    );
  }
  return null;
}

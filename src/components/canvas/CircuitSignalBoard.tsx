import { useId, type CSSProperties } from 'react';
import { BOARD_WIDTH, BOARD_HEIGHT, MODULE_LIGHTS, type SystemModuleId } from './systemModuleLayout';
import './CircuitSignalBoard.css';

export const CIRCUIT_DESKTOP_EXIT_Y = 0.62;
export const CIRCUIT_MOBILE_EXIT_X = 0.95;

export const CIRCUIT_CHARGE_MS = 90;
export const CIRCUIT_BURST_MS = 320;

type BranchId = Exclude<SystemModuleId, 'core'>;

// Each route starts underneath its module and ends underneath the central stack.
const BRANCHES = [
  { id: 'frontend', x: 230, y: 231, path: 'M230 231 Q245 251 280 251 H338 Q351 251 361 261 L431 331 Q450 350 500 391' },
  { id: 'backend', x: 770, y: 231, path: 'M770 231 Q755 251 720 251 H665 Q649 251 639 261 L565 335 Q546 354 500 391' },
  { id: 'infra', x: 230, y: 624, path: 'M230 624 Q251 591 288 591 H327 Q345 591 358 578 L429 507 Q443 493 443 476 V448 Q443 423 500 391' },
  { id: 'data', x: 770, y: 624, path: 'M770 624 Q746 591 709 591 H673 Q655 591 642 578 L571 507 Q557 493 557 476 V448 Q557 423 500 391' },
] satisfies { id: BranchId; x: number; y: number; path: string }[];

const EDGE_START = ' Q537 420 569 420 H638 Q657 420 670 433 L689 452 Q702 465 718 465';
const DESKTOP_EXIT = `${EDGE_START} H${BOARD_WIDTH}`;
const MOBILE_EXIT = `${EDGE_START} H859 Q876 465 888 477 L938 527 Q950 539 950 556 V${BOARD_HEIGHT}`;

const RIBBONS = [
  { id: 'frontend', color: '#27f6eb', start: [0, 22], end: [346, 274],
    paths: ['M-45 15 C64 27 46 106 116 126 S221 117 244 180 S251 249 346 274', 'M-45 42 C56 46 79 145 154 144 S216 144 240 190 S271 252 346 274', 'M-45 0 C57 18 68 68 105 99 S210 109 241 164 S256 237 346 274'] },
  { id: 'backend', color: '#ff9c45', start: [1032, 15], end: [710, 263],
    paths: ['M1032 15 C964 24 925 99 878 118 S802 133 780 194 S744 241 710 263', 'M1032 45 C978 45 943 104 894 131 S813 144 786 203 S756 242 710 263'] },
  { id: 'infra', color: '#ffc167', start: [-30, 739], end: [354, 590],
    paths: ['M-30 739 C82 707 105 669 148 663 S219 658 246 624 S301 599 354 590', 'M-30 715 C62 691 105 632 152 638 S227 648 254 616 S313 591 354 590'] },
  { id: 'data', color: '#a084ff', start: [1032, 747], end: [675, 596],
    paths: ['M1032 747 C939 758 931 702 867 690 S801 686 774 646 S724 595 675 596', 'M1032 709 C953 716 921 664 875 660 S817 674 782 641 S717 599 675 596', 'M1032 768 C945 775 916 739 876 722 S810 702 776 658 S724 606 675 596'] },
] as const;

interface CircuitSignalBoardProps {
  selectedId: SystemModuleId | null;
  transmitting: boolean;
  mobile: boolean;
}

export function CircuitSignalBoard({ selectedId, transmitting, mobile }: CircuitSignalBoardProps) {
  const uid = useId();
  const edge = mobile ? MOBILE_EXIT : DESKTOP_EXIT;
  const edgePath = `M500 391${edge}`;
  const branch = BRANCHES.find(item => item.id === selectedId);
  const selectedPath = `${branch?.path ?? 'M500 391'}${edge}`;
  const jack = mobile ? 'translate(950 742) rotate(90)' : 'translate(992 465)';

  return (
    <svg className="circuit-signal-board"
      viewBox={`0 0 ${BOARD_WIDTH} ${BOARD_HEIGHT}`} preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <defs>
        <filter id={`${uid}-mist`} x="-45%" y="-90%" width="190%" height="280%" colorInterpolationFilters="sRGB">
          <feGaussianBlur stdDeviation="9" />
        </filter>
        {RIBBONS.map(({ id, start, end, color }) => (
          <linearGradient key={id} id={`${uid}-${id}`} gradientUnits="userSpaceOnUse"
            x1={start[0]} y1={start[1]} x2={end[0]} y2={end[1]}>
            <stop stopColor={color} stopOpacity=".1" />
            <stop offset=".34" stopColor={color} stopOpacity=".92" />
            <stop offset=".61" stopColor={id === 'data' ? '#5ad6ff' : '#f1ffff'} stopOpacity=".83" />
            <stop offset="1" stopColor={color} stopOpacity="0" />
          </linearGradient>
        ))}
      </defs>

      <path className="circuit-copper circuit-copper--edge" d={edgePath} />
      {BRANCHES.map(({ id, x, y, path }) => (
        <g key={id} data-dimmed={Boolean(selectedId && selectedId !== id)}>
          <path className="circuit-copper" d={path} />
          <circle className="circuit-junction" cx={x} cy={y} r="7" />
        </g>
      ))}

      <g className="circuit-ribbons">
        {RIBBONS.map(({ id, paths }) => (
          <g key={id} className="circuit-ribbon" data-dimmed={Boolean(selectedId)} stroke={`url(#${uid}-${id})`}>
            {paths.map(path => <path key={path} className="circuit-ribbon__vapor" d={path} filter={`url(#${uid}-mist)`} />)}
            {paths.map(path => <path key={path} className="circuit-ribbon__silk" d={path} />)}
            {paths.map(path => <path key={path} className="circuit-ribbon__thread" d={path} pathLength="100" />)}
          </g>
        ))}
      </g>

      <g className="circuit-jack" transform={jack} style={{ color: MODULE_LIGHTS[selectedId ?? 'core'] }}>
        <path d="M-12 -8H12V8H-12L-15 4V-4Z" />
        <path d="M-7 -2H12 M-7 2H12" />
      </g>
      {selectedId && transmitting && (
        <g key={selectedId} className="circuit-comet" style={{
          color: MODULE_LIGHTS[selectedId],
          '--travel': `${CIRCUIT_BURST_MS}ms`,
          '--delay': `${CIRCUIT_CHARGE_MS}ms`,
        } as CSSProperties}>
          <path className="circuit-comet__wake" d={selectedPath} pathLength="100" />
          <path className="circuit-comet__tail" d={selectedPath} pathLength="100" />
          <path className="circuit-comet__filament" d={selectedPath} pathLength="100" />
          <path className="circuit-comet__head" d={selectedPath} pathLength="100" />
        </g>
      )}
    </svg>
  );
}

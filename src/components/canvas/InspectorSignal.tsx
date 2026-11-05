import { useEffect, useState } from 'react';
import './InspectorSignal.css';

// Draw both halves from the physical inlet, so the trace stays aligned after a resize.
export function inspectorTracePaths(width: number, height: number, inlet: number, compact: boolean) {
  const left = 1;
  const top = 1;
  const right = width - 1;
  const bottom = height - 1;
  const corner = 9;
  const middleX = width / 2;
  const middleY = height / 2;

  if (compact) {
    return [
      `M${inlet} ${top} H10 Q1 1 1 10 V${bottom - corner} Q1 ${bottom} 10 ${bottom} H${middleX}`,
      `M${inlet} ${top} H${right - corner} Q${right} 1 ${right} 10 V${bottom - corner} Q${right} ${bottom} ${right - corner} ${bottom} H${middleX}`,
    ];
  }
  return [
    `M${left} ${inlet} V10 Q1 1 10 1 H${right - corner} Q${right} 1 ${right} 10 V${middleY}`,
    `M${left} ${inlet} V${bottom - corner} Q1 ${bottom} 10 ${bottom} H${right - corner} Q${right} ${bottom} ${right} ${bottom - corner} V${middleY}`,
  ];
}

const HEX = '0123456789ABCDEF';

export function SignalDecode({ text, animate }: { text: string; animate: boolean }) {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!animate) {
      setFrame(0);
      return;
    }
    const start = performance.now();
    const timer = window.setInterval(() => {
      const step = Math.floor((performance.now() - start) / 25);
      setFrame(Math.min(step, 8));
      if (step >= 8) window.clearInterval(timer);
    }, 25);
    return () => window.clearInterval(timer);
  }, [animate]);

  if (!animate || frame >= 8) return <>{text}</>;

  const decoded = Math.floor(text.length * frame / 8);
  const cipher = [...text].map((letter, index) =>
    index < decoded || !/[A-Z0-9]/.test(letter) ? letter : HEX[(index * 7 + frame * 11) % HEX.length],
  ).join('');

  return (
    <span className="cyber-decode">
      <span className="cyber-decode-label">{text}</span>
      <span className="cyber-decode-cipher" aria-hidden="true">{cipher}</span>
    </span>
  );
}

const BOARD_SIZES = '(min-width: 1520px) 625px, (min-width: 1280px) calc(60vw - 280px), (min-width: 760px) calc(100vw - 300px), (max-width: 600px) calc(148vw - 48px), 100vw';

export function NanoCircuitBackdrop() {
  return (
    <picture className="cyber-nano-space" aria-hidden="true">
      <source type="image/avif" srcSet="./nano-circuit-board-v3-960.avif 960w, ./nano-circuit-board-v3-1448.avif 1448w" sizes={BOARD_SIZES} />
      <img className="cyber-nano-layer" src="./nano-circuit-board-v3-960.webp"
        srcSet="./nano-circuit-board-v3-960.webp 960w, ./nano-circuit-board-v3-1448.webp 1448w" sizes={BOARD_SIZES}
        width="1448" height="1086" alt="" decoding="async" draggable={false} {...{ fetchpriority: 'low' }} />
    </picture>
  );
}

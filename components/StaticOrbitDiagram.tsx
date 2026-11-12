/** Lightweight illustrative fallback; no animation, simulated telemetry or WebGL. */
export default function StaticOrbitDiagram() {
  return (
    <div className="relative flex-1 min-h-0 flex flex-col bg-bg">
      <p className="px-4 pt-3 font-mono text-[0.65rem] text-muted">LEO constellation / schematic</p>
      <svg viewBox="0 0 600 340" className="w-full flex-1 min-h-0" role="img" aria-label="Illustrative satellite orbits around Earth">
        <g fill="currentColor" className="text-muted" opacity="0.4">
          {[[45, 48], [108, 220], [520, 69], [474, 275], [300, 32], [560, 202], [68, 300], [210, 65]].map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.5" />)}
        </g>
        <g fill="none" className="text-line" stroke="currentColor" strokeWidth="1.5">
          <ellipse cx="300" cy="170" rx="215" ry="70" transform="rotate(-25 300 170)" />
          <ellipse cx="300" cy="170" rx="215" ry="70" transform="rotate(35 300 170)" />
          <ellipse cx="300" cy="170" rx="215" ry="70" transform="rotate(95 300 170)" />
        </g>
        <circle cx="300" cy="170" r="74" className="fill-surface-2 stroke-muted" />
        <g fill="none" className="text-muted" stroke="currentColor" opacity="0.5">
          <ellipse cx="300" cy="170" rx="31" ry="74" />
          <ellipse cx="300" cy="170" rx="74" ry="25" />
          <path d="M226 170h148M300 96v148" />
        </g>
        <g className="text-accent" fill="currentColor" stroke="currentColor">
          {[[110, 210], [455, 270], [322, 35]].map(([x, y]) => <g key={x} transform={`translate(${x} ${y})`}><rect x="-5" y="-5" width="10" height="10" /><path d="M-15-3h7v6h-7zm23 0h7v6H8z" fill="none" strokeWidth="2" /></g>)}
        </g>
        <text x="300" y="278" textAnchor="middle" className="fill-muted font-mono text-xs">Earth</text>
      </svg>
      <p className="px-4 pb-3 text-center font-mono text-[0.6rem] text-muted">Illustrative layout · not live tracking</p>
    </div>
  );
}

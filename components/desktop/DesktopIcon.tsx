import type { IconName } from '@/components/desktop/windows';

/*
 * Desktop icons, drawn here as flat two-pixel-stroke SVG so they stay crisp
 * at any zoom and need no image requests. Decorative: the label next to each
 * one carries the name.
 */
const STROKE = { stroke: '#000', strokeWidth: 2, strokeLinejoin: 'miter' as const };

const PAGE = <path d="M9 4h15l8 8v24H9z" fill="#fff" {...STROKE} />;
const FOLD = <path d="M24 4v8h8" fill="none" {...STROKE} />;

const ICONS: Record<IconName, React.ReactNode> = {
  doc: (
    <>
      {PAGE}
      {FOLD}
      <path d="M14 19h13M14 24h13M14 29h8" fill="none" {...STROKE} />
    </>
  ),
  folder: (
    <>
      <path d="M4 10h12l4 4h16v20H4z" fill="#e8b84a" {...STROKE} />
      <path d="M4 17h32" {...STROKE} />
    </>
  ),
  book: (
    <>
      <path d="M6 7h13l1 2 1-2h13v25H21l-1 2-1-2H6z" fill="#fff" {...STROKE} />
      <path d="M20 9v23M10 14h6M10 19h6M24 14h6M24 19h6" fill="none" {...STROKE} />
    </>
  ),
  chip: (
    <>
      <rect x="10" y="10" width="20" height="20" fill="#c0c0c0" {...STROKE} />
      <rect x="15" y="15" width="10" height="10" fill="#ff6a00" {...STROKE} />
      <path d="M14 10V5M20 10V5M26 10V5M14 35v-5M20 35v-5M26 35v-5M10 14H5M10 20H5M10 26H5M35 14h-5M35 20h-5M35 26h-5" {...STROKE} />
    </>
  ),
  news: (
    <>
      <rect x="6" y="7" width="28" height="26" fill="#fff" {...STROKE} />
      <rect x="10" y="11" width="9" height="8" fill="#ff6a00" {...STROKE} />
      <path d="M23 12h7M23 17h7M10 24h20M10 29h20" fill="none" {...STROKE} />
    </>
  ),
  tent: (
    <>
      <path d="M20 6 4 33h32z" fill="#e8b84a" {...STROKE} />
      <path d="M20 16l-7 17h14z" fill="#000" {...STROKE} />
      <path d="M2 33h36" {...STROKE} />
    </>
  ),
  mail: (
    <>
      <rect x="4" y="9" width="32" height="22" fill="#fff" {...STROKE} />
      <path d="M4 9l16 13L36 9" fill="none" {...STROKE} />
    </>
  ),
  terminal: (
    <>
      <rect x="4" y="6" width="32" height="27" fill="#c0c0c0" {...STROKE} />
      <rect x="8" y="10" width="24" height="19" fill="#000" {...STROKE} />
      <path d="M12 15l5 4-5 4M20 24h8" fill="none" stroke="#ff6a00" strokeWidth={2} />
    </>
  ),
  globe: (
    <>
      <circle cx="20" cy="20" r="13" fill="#fff" {...STROKE} />
      <ellipse cx="20" cy="20" rx="5.5" ry="13" fill="none" {...STROKE} />
      <path d="M7 20h26" {...STROKE} />
      <ellipse cx="20" cy="20" rx="18" ry="6" fill="none" stroke="#ff6a00" strokeWidth={2} transform="rotate(-25 20 20)" />
    </>
  ),
  cap: (
    <>
      <path d="M20 8 3 16l17 8 17-8z" fill="#000" {...STROKE} />
      <path d="M10 20v8c3 3 6 4 10 4s7-1 10-4v-8" fill="#c0c0c0" {...STROKE} />
      <path d="M35 17v11" stroke="#ff6a00" strokeWidth={2} />
    </>
  ),
  pdf: (
    <>
      {PAGE}
      {FOLD}
      <rect x="4" y="20" width="24" height="11" fill="#b3261e" {...STROKE} />
      <path d="M9 28v-5M14 28v-5M19 28v-5M23 28v-5" stroke="#fff" strokeWidth={2} />
    </>
  ),
};

export default function DesktopIcon({ name, size = 40, className }: { name: IconName; size?: number; className?: string }) {
  return (
    <svg aria-hidden="true" focusable="false" className={className} width={size} height={size} viewBox="0 0 40 40" shapeRendering="crispEdges">
      {ICONS[name]}
    </svg>
  );
}

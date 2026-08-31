import sharp from "sharp";

/*
 * Renders the 1200x630 social card. Run once and commit the PNG: generating
 * it in CI would depend on whatever fonts the runner happens to have, and a
 * card that silently changes shape is worse than a checked-in file.
 *
 *   node scripts/make-og.mjs
 */

const W = 1200;
const H = 630;
const escape = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const NAME = "Md Muntasir Hossain";
const ROLE = "Doctor of Engineering — Electrical &amp; Computer Engineering";
const LINE = "AI-enabled cybersecurity for LEO satellite communications";
const FOOT = "Lamar University · Center of Data, AI and Cybersecurity";

// A monospace stack rather than a single family: whichever exists locally.
const MONO = "JetBrains Mono, Consolas, DejaVu Sans Mono, Menlo, monospace";

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <rect width="${W}" height="${H}" fill="#050807"/>
  <g stroke="#1c2a20" stroke-width="1">
    ${Array.from({ length: Math.floor(H / 42) }, (_, i) => `<line x1="0" y1="${i * 42}" x2="${W}" y2="${i * 42}"/>`).join("")}
  </g>
  <rect x="48" y="48" width="${W - 96}" height="${H - 96}" fill="none" stroke="#00b36e" stroke-width="2"/>
  <text x="88" y="132" font-family="${MONO}" font-size="26" fill="#00ff9c">muntasir@portfolio:~$ whoami</text>
  <text x="88" y="238" font-family="${MONO}" font-size="72" font-weight="bold" fill="#cfe8d6">${escape(NAME)}</text>
  <text x="88" y="300" font-family="${MONO}" font-size="28" fill="#7ba189">${ROLE}</text>
  <text x="88" y="396" font-family="${MONO}" font-size="34" fill="#00ff9c">${escape(LINE)}</text>
  <rect x="88" y="430" width="640" height="2" fill="#1c2a20"/>
  <text x="88" y="500" font-family="${MONO}" font-size="24" fill="#7ba189">${FOOT}</text>
  <text x="88" y="546" font-family="${MONO}" font-size="24" fill="#7ba189">muhit1204.github.io</text>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile("public/og.png");
console.log("wrote public/og.png");

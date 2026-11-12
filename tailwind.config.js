/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Wires `font-sans` to the Noto Serif variable set in app/layout.tsx.
        // The utility keeps its name so no component had to change; the
        // fallbacks are serif so a slow font load does not reflow to sans.
        sans: ['var(--font-sans)', 'Georgia', 'Times New Roman', 'serif'],
        // JetBrains Mono carries the terminal voice: prompts, labels, metadata.
        mono: [
          'var(--font-mono)',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Consolas',
          'monospace',
        ],
      },
      // Mirrors the custom properties in app/globals.css so components use
      // bg-surface / text-muted / border-line instead of hardcoded slates.
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        'surface-2': 'var(--surface-2)',
        line: 'var(--border)',
        body: 'var(--text)',
        muted: 'var(--muted)',
        accent: 'var(--accent)',
        'accent-dim': 'var(--accent-dim)',
        warn: 'var(--warn)',
        danger: 'var(--danger)',
      },
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Wires `font-sans` to the Inter variable set in app/layout.tsx.
        // Without this, Tailwind's default system stack wins and Inter never loads visually.
        sans: [
          'var(--font-sans)',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
        // JetBrains Mono is the only typeface on the site; `font-sans` is
        // kept pointing at Inter for the rare block of long-form prose.
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

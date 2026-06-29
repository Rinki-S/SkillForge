/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Neutrals stay as-is — they already match Kumo's neutral ramp.
        // The accent tokens below keep their historical names (`orange`,
        // `brand`) but their VALUES are now Cloudflare Kumo's brand blue:
        // sRGB hex equivalents of kumo-standalone.css --color-kumo-brand and
        // --color-blue-{500,600,700}. Hex (not oklch) so Tailwind's `/opacity`
        // modifiers like `console-orange/20` keep working. Every existing
        // `console-orange` / `brand-700` / `orangeSoft` class now aligns with
        // Kumo components without touching the call sites.
        console: {
          canvas: '#F7F7F4',
          panel: '#FFFFFF',
          ink: '#1D1D1B',
          muted: '#6B6B63',
          line: '#D9D9D3',
          subtle: '#EDEDE8',
          orange: '#056dff', // = --color-kumo-brand (primary blue)
          orangeSoft: '#deecff', // soft blue tint for hovers/fills
          code: '#101010',
        },
        brand: {
          50: '#eff6ff',
          100: '#d9e9ff',
          500: '#2b7fff', // = --color-blue-500
          600: '#155dfc', // = --color-blue-600
          700: '#1447e6', // = --color-blue-700 / kumo-brand-hover
        },
      },
      boxShadow: {
        soft: '0 1px 2px rgba(29, 29, 27, 0.05)',
        subtle: '0 1px 2px rgba(29, 29, 27, 0.05)',
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'sans-serif',
        ],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
};

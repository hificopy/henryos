import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        page: '#0a0a0a',
        card: '#111111',
        'card-hover': '#1a1a1a',
        border: '#222222',
        'text-primary': '#ffffff',
        'text-secondary': '#888888',
        amber: {
          DEFAULT: '#d4a843',
          light: '#e8c46a',
        },
        status: {
          green: '#22c55e',
          yellow: '#eab308',
          red: '#ef4444',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
} satisfies Config;

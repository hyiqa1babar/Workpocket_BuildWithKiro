import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Warm paper / notebook tones
        paper: {
          50: '#fffdf7',
          100: '#fdf9ee',
          200: '#f7f0dd',
          300: '#ece0c4',
        },
        ink: {
          DEFAULT: '#2b2a33',
          soft: '#565463',
          faint: '#8b8896',
        },
        // Funky highlighter pops
        marker: {
          pink: '#ff5c8a',
          yellow: '#ffd23f',
          mint: '#2ec4b6',
          sky: '#4d96ff',
          purple: '#9b5de5',
          orange: '#ff8c42',
        },
      },
      fontFamily: {
        // Hand-drawn headings + notes
        hand: ['"Patrick Hand"', 'cursive'],
        marker: ['"Permanent Marker"', 'cursive'],
        note: ['Kalam', 'cursive'],
        sans: ['Nunito', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        sketch: '3px 3px 0 0 rgba(43,42,51,0.9)',
        'sketch-sm': '2px 2px 0 0 rgba(43,42,51,0.85)',
        'sketch-color': '3px 3px 0 0 var(--tw-shadow-color)',
      },
      keyframes: {
        wobble: {
          '0%,100%': { transform: 'rotate(-1deg)' },
          '50%': { transform: 'rotate(1deg)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        wobble: 'wobble 0.4s ease-in-out',
        fadeIn: 'fadeIn 0.25s ease-out',
      },
    },
  },
  plugins: [],
} satisfies Config;

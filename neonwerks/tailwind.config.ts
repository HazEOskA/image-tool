import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#050507',
          900: '#0a0a0a',
          850: '#0d0d12',
          800: '#111118',
          700: '#1a1a24',
        },
        neon: {
          cyan: '#34e2ff',
          blue: '#4f8bff',
          purple: '#9b6bff',
          pink: '#ff5ed3',
        },
        // Street Cyber OS palette (1:1 with the portfolio brain)
        concrete: '#131313',
        surface: '#1a1a1a',
        steel: '#252525',
        wire: '#333333',
        smoke: '#808080',
        fog: '#444444',
        'off-white': '#f2f2f0',
        orange: '#ff4500',
        'green-neon': '#39ff14',
        yellow: '#ffe500',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Segoe UI', 'sans-serif'],
        display: ['"Bebas Neue"', 'Impact', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      fontSize: {
        'display-md': ['clamp(2rem,5vw,4.5rem)', { lineHeight: '1.0', letterSpacing: '0.03em' }],
        label: ['0.625rem', { lineHeight: '1', letterSpacing: '0.22em' }],
      },
      boxShadow: {
        glow: '0 0 40px -8px rgba(52, 226, 255, 0.45)',
        'glow-purple': '0 0 50px -10px rgba(155, 107, 255, 0.5)',
        card: '0 18px 60px -18px rgba(0, 0, 0, 0.7)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'pulse-line': {
          '0%, 100%': { opacity: '0.25' },
          '50%': { opacity: '0.9' },
        },
        shimmer: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '200% 50%' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'pulse-line': 'pulse-line 3s ease-in-out infinite',
        shimmer: 'shimmer 8s linear infinite',
      },
    },
  },
  plugins: [],
} satisfies Config;

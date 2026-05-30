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
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Segoe UI', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
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

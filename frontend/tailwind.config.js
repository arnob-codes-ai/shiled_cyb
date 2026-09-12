/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#070b14',
          panel: 'rgba(10, 16, 30, 0.75)',
          'panel-light': 'rgba(16, 26, 48, 0.6)',
          border: 'rgba(0, 240, 255, 0.18)',
          'border-subtle': 'rgba(255, 255, 255, 0.08)',
          cyan: '#00f0ff',
          blue: '#0ea5e9',
          navy: '#0b1329',
          accent: '#38bdf8',
          red: '#ef4444',
          'red-glow': 'rgba(239, 68, 68, 0.35)',
          amber: '#f59e0b',
          'amber-glow': 'rgba(245, 158, 11, 0.35)',
          green: '#10b981',
          'green-glow': 'rgba(16, 185, 129, 0.35)',
          purple: '#a855f7',
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'Consolas', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'neon-cyan': '0 0 15px rgba(0, 240, 255, 0.3)',
        'neon-red': '0 0 15px rgba(239, 68, 68, 0.4)',
        'neon-amber': '0 0 15px rgba(245, 158, 11, 0.4)',
        'neon-green': '0 0 15px rgba(16, 185, 129, 0.4)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.4)',
        'hud': 'inset 0 0 15px rgba(0, 240, 255, 0.05), 0 4px 20px rgba(0, 0, 0, 0.5)',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scanline': 'scanline 8s linear infinite',
        'radar-sweep': 'radar-sweep 4s linear infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.6', transform: 'scale(1.05)' },
        },
        'scanline': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        },
        'radar-sweep': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      }
    },
  },
  plugins: [],
}

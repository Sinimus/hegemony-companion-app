import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        class: {
          working: '#e74c3c',    // Working Class Red
          middle: '#f1c40f',     // Middle Class Yellow
          capitalist: '#3498db', // Capitalist Blue
          state: '#95a5a6',      // State Grey
        },
        policy: {
          socialism: '#e74c3c',  // A - Progressive
          mixed: '#f1c40f',      // B - Balanced
          neoliberal: '#3498db', // C - Free Market
        }
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [],
};

export default config;
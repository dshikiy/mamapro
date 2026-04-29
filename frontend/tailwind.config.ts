import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Wellness palette - мягкие, тёплые, спокойные цвета
        cream: '#F9F6F3',
        beige: '#F5E6D3',
        'soft-pink': '#F0D9D1',
        'lavender': '#E8D5F2',
        'sage': '#D4E5D9',
        
        // Darker tones для текста и действий
        'warm-gray': '#8B8680',
        'dark-text': '#5A5A5A',
        'accent-pink': '#D4A5A0',
        'accent-purple': '#C9A8D8',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      borderRadius: {
        'lg': '16px',
        'xl': '20px',
      },
      boxShadow: {
        'soft': '0 4px 15px rgba(0, 0, 0, 0.08)',
        'softer': '0 2px 8px rgba(0, 0, 0, 0.05)',
        'warm': '0 6px 20px rgba(212, 165, 160, 0.15)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-in': 'slideIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideIn: {
          from: {
            opacity: '0',
            transform: 'translateY(10px)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },
    },
  },
  plugins: [],
}
export default config

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
        // Обновленная палитра - свежая и чистая
        cream: '#F8F9FA',       // Очень светлый, чистый фон (светло-серый/белый)
        beige: '#E9ECEF',       // Светлый серый для акцентов
        'soft-pink': '#F4E6E8', // Очень нежный розовый
        'lavender': '#E2E0EB',  // Нежный лавандовый
        'sage': '#E0EAE5',      // Светлый мятно-полынный
        
        // Текст и основные акценты
        'warm-gray': '#6C757D',
        'dark-text': '#212529',
        'accent-pink': '#D69EAB', // Красивый пудровый
        'accent-purple': '#A6A2C2',
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

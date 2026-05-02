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
        // MamaPro Soft UI Design System
        // Backgrounds
        cream: '#FDFBF7',          // Main background — warm off-white
        'card-bg': '#FFFFFF',      // Card backgrounds
        'card-hover': '#FAF8F4',   // Card hover state
        beige: '#F3EEE7',          // Secondary background / dividers

        // Brand Neutrals (soft warm grays)
        'warm-gray': '#9E9589',
        'medium-gray': '#7B7269',
        'dark-text': '#3D3530',    // Main text — dark warm brown (not pure black)

        // Primary Brand Colors (muted, sophisticated)
        'sage': '#A3C8B7',         // Muted mint / teal-green — primary CTA
        'sage-light': '#C8E0D6',   // Light mint for badges, highlights
        'sage-dark': '#7BAF9E',    // Darker mint for hover states

        'rose': '#BCAAA4',         // Dusty pink-rose — secondary accent
        'rose-light': '#D4C4C0',   // Light rose
        'rose-dark': '#A08880',    // Darker rose for hover

        // Legacy aliases (keep compatibility)
        'soft-pink': '#F0E6E4',
        'lavender': '#E8E6F0',
        'accent-pink': '#BCAAA4',
        'accent-purple': '#9E96C0',
      },
      fontFamily: {
        sans: ['Inter', 'Nunito', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '88': '22rem',
      },
      borderRadius: {
        'xl': '16px',
        '2xl': '20px',
        '3xl': '24px',
        '4xl': '32px',
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(61, 53, 48, 0.08)',
        'softer': '0 2px 10px rgba(61, 53, 48, 0.05)',
        'card': '0 2px 12px rgba(61, 53, 48, 0.06)',
        'warm': '0 6px 24px rgba(163, 200, 183, 0.25)',
        'rose': '0 6px 24px rgba(188, 170, 164, 0.25)',
        'elevated': '0 12px 40px rgba(61, 53, 48, 0.12)',
        'inner-soft': 'inset 0 2px 6px rgba(61, 53, 48, 0.06)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'skeleton': 'skeleton 1.5s ease-in-out infinite',
        'bounce-gentle': 'bounceGentle 0.6s ease',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          from: { opacity: '0', transform: 'translateY(-10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        skeleton: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
      },
      backgroundImage: {
        'gradient-warm': 'linear-gradient(135deg, #FDFBF7 0%, #F3EEE7 100%)',
        'gradient-sage': 'linear-gradient(135deg, #A3C8B7 0%, #7BAF9E 100%)',
        'gradient-rose': 'linear-gradient(135deg, #BCAAA4 0%, #A08880 100%)',
        'gradient-hero': 'linear-gradient(135deg, #F0E6E4 0%, #C8E0D6 50%, #E8E6F0 100%)',
      },
    },
  },
  plugins: [],
}
export default config

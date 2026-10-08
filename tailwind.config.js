/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        zcafe: {
          cream: {
            50: '#FFFCF7',
            100: '#FFFDF9',
            200: '#FFF8EE', // Primary warm cream background (Light Mode)
            300: '#F5EBE1',
            400: '#EBDCCE',
            500: '#D2BCAB',
          },
          maroon: {
            DEFAULT: '#5A1A2B', // Primary brand maroon
            900: '#230B13',
            800: '#3E1220',
            700: '#4D1726',
            600: '#5A1A2B',
            500: '#752438',
            400: '#94324B',
          },
          gold: {
            DEFAULT: '#F7B52C', // Signature golden-yellow
            300: '#FFE185',
            400: '#FED053',
            500: '#F7B52C',
            600: '#E09C17',
            700: '#B87B08',
          },
          amber: {
            400: '#FFAF38',
            500: '#FF9F1C',
            600: '#E68500',
          },
          green: {
            DEFAULT: '#4F8F3A', // Fresh veg green
            400: '#68B34F',
            500: '#4F8F3A',
            600: '#3C702A',
          },
          chilli: {
            DEFAULT: '#E63946', // Spicy chilli red & offer banners
            400: '#EF5D68',
            500: '#E63946',
            600: '#C72533',
          },
          dark: {
            bg: '#120A0C', // Dark mode body background
            surface: '#1D0E14', // Dark mode card surface
            elevated: '#28121B', // Dark mode elevated card
            border: '#3E1825',
          },
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-montserrat)', 'var(--font-poppins)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '1.75rem',
      },
      boxShadow: {
        'soft-card': '0 10px 30px -5px rgba(90, 26, 43, 0.08), 0 4px 12px -2px rgba(0, 0, 0, 0.04)',
        'soft-card-hover': '0 20px 40px -10px rgba(90, 26, 43, 0.16), 0 8px 16px -4px rgba(247, 181, 44, 0.12)',
        'glow-gold': '0 0 25px -4px rgba(247, 181, 44, 0.45)',
        'glow-gold-lg': '0 0 40px 2px rgba(247, 181, 44, 0.55)',
        'glow-amber': '0 0 30px -4px rgba(255, 159, 28, 0.45)',
        'glow-chilli': '0 0 25px -4px rgba(230, 57, 70, 0.4)',
        'badge-sticker': '0 4px 12px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
      },
      animation: {
        'steam': 'steamRise 3s ease-out infinite',
        'steam-delay': 'steamRise 3s ease-out 1.5s infinite',
        'float-slow': 'floatSlow 5s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 2.5s infinite',
      },
      keyframes: {
        steamRise: {
          '0%': { transform: 'translateY(0) scaleX(1)', opacity: '0.8' },
          '50%': { transform: 'translateY(-18px) scaleX(1.3)', opacity: '0.4' },
          '100%': { transform: 'translateY(-36px) scaleX(1.6)', opacity: '0' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-8px) rotate(1deg)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
    },
  },
  plugins: [],
};

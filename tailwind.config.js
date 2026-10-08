/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        zcafe: {
          burgundy: {
            900: '#230B13',
            800: '#3E1220', // Primary background
            700: '#4D1726',
            600: '#5A1A2B', // Lighter maroon
            500: '#752438',
          },
          charcoal: {
            950: '#0B0507',
            900: '#120A0C', // Secondary dark background
            800: '#1D1216',
            700: '#2A1C22',
            600: '#3D2A32',
          },
          gold: {
            400: '#FED053',
            500: '#F7B52C', // Signature glowing golden-yellow
            600: '#E09C17',
          },
          amber: {
            400: '#FFAF38',
            500: '#FF9F1C', // Warm amber counter light
            600: '#E68500',
          },
          cream: {
            100: '#FFFDF9',
            200: '#FFF8EE', // Warm white text
            300: '#F5EBE1', // Soft cream
            400: '#DCCBBD',
            500: '#A8998C',
          },
          neon: {
            pink: '#FF3B5C', // "Tea Coffee" neon
            green: '#4F8F3A', // Vine leaf green
          }
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-montserrat)', 'var(--font-poppins)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-gold': '0 0 25px -4px rgba(247, 181, 44, 0.45)',
        'glow-gold-lg': '0 0 40px 2px rgba(247, 181, 44, 0.55)',
        'glow-amber': '0 0 30px -4px rgba(255, 159, 28, 0.45)',
        'glow-neon': '0 0 20px -2px rgba(255, 59, 92, 0.5)',
        'counter-led': '0 4px 30px 2px rgba(255, 159, 28, 0.25)',
      },
      animation: {
        'flicker': 'flicker 3s infinite',
        'sway': 'sway 4s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 2.5s infinite',
      },
      keyframes: {
        flicker: {
          '0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100%': {
            opacity: '1',
            filter: 'drop-shadow(0 0 8px #FF3B5C) drop-shadow(0 0 18px rgba(255,59,92,0.8))',
          },
          '20%, 21.999%, 63%, 63.999%, 65%, 69.999%': {
            opacity: '0.4',
            filter: 'none',
          },
        },
        sway: {
          '0%, 100%': { transform: 'rotate(-2deg)' },
          '50%': { transform: 'rotate(2.5deg)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.75' },
        }
      }
    },
  },
  plugins: [],
};

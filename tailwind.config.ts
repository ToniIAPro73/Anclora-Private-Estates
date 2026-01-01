import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Paleta Anclora Private Estates
        anclora: {
          gold: '#C5A059',
          'gold-light': '#D4B575',
          'gold-dark': '#A6834A',
          black: '#000000',
          'gray-dark': '#1A1A1A',
          'gray-medium': '#4A4A4A',
          'gray-light': '#E5E5E5',
          beige: '#F5F5DC',
          'beige-light': '#FAF9F6',
          white: '#FFFFFF',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Helvetica', 'Arial', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'Times New Roman', 'serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '100': '25rem',
        '112': '28rem',
        '128': '32rem',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in-out',
        'slide-up': 'slideUp 0.8s ease-out',
        'slide-down': 'slideDown 0.8s ease-out',
        'scale-in': 'scaleIn 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-anclora': 'linear-gradient(135deg, #000000 0%, #1A1A1A 100%)',
        'gradient-gold': 'linear-gradient(135deg, #C5A059 0%, #A6834A 100%)',
      },
    },
  },
  plugins: [],
};

export default config;

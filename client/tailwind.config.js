/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#C1272D',
          'red-dark': '#921E23',
          'red-light': '#E84040',
          gold: '#DA9100',
          'gold-light': '#F5C842',
        },
        cream: '#FFF8F2',
        'cream-dark': '#F5EDE3',
        dark: '#0F0D0B',
        'dark-surface': '#1A1614',
        border: '#E8E0D6',
      },
      fontFamily: {
        heading: ['Catamaran', 'sans-serif'],
        body: ['Nunito Sans', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 16px rgba(0,0,0,0.07)',
        'card-hover': '0 12px 40px rgba(0,0,0,0.15)',
        red: '0 8px 32px rgba(193,39,45,0.35)',
        glass: '0 8px 32px rgba(0,0,0,0.12)',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(105deg, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.50) 50%, rgba(0,0,0,0.15) 100%)',
        'card-gradient': 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)',
        'red-gradient': 'linear-gradient(135deg, #C1272D 0%, #921E23 100%)',
        'gold-gradient': 'linear-gradient(135deg, #DA9100 0%, #F5C842 100%)',
        'dark-gradient': 'linear-gradient(135deg, #0F0D0B 0%, #1A1614 100%)',
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '32px',
      },
    },
  },
  plugins: [],
}

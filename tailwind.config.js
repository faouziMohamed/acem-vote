/* eslint-disable global-require */

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  plugins: [require('@tailwindcss/line-clamp')],
  theme: {
    extend: {
      screens: {
        xs: '420px',
        '2xs': '320px',
      },
      colors: {
        primary: '#000ba5',
        primaryOpaque: 'rgba(0, 9, 142, 0.39)',
        secondary: '#0E7490',
        secondaryOpaque: 'rgba(0, 140, 107, 0.25)',
      },
      zIndex: {
        base: '1',
        modal: '200',
      },
    },
  },
};

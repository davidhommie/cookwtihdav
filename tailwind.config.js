module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: { brand: { DEFAULT: '#E10600', dark: '#A80000' }, sun: '#FFD400', ink: '#1B1210', paper: '#FAF7F5' },
      fontFamily: { display: ['Cinzel', 'serif'], body: ['Lato', 'sans-serif'] },
    },
  },
  plugins: [],
};

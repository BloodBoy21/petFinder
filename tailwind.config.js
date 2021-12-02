module.exports = {
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
    backgroundColor: (theme) => ({
      ...theme('colors'),
      header: '#4f5d75',
      cardContent: '#343633'
    }),
    fontFamily: {
      body: ['Outfit, sans-serif'],
      dosis: ['Dosis, sans-serif'],
      confortaa: ['Confortaa, sans-serif']
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
}

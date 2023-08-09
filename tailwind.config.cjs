/** @type {import('tailwindcss').Config} */
module.exports = {
  content:["./src/**/*.tsx"],
  theme: {
    extend: {
      container: {
        padding: {
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem',
        },
      },
    },
  },
  plugins: [],
}

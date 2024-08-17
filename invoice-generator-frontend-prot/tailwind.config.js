/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'darkBlueImage': "url(/src/assets/background.jpg)"
      },
      colors: {
        'white': '#FEFEFE',
        'lightBlue': '#66FCF1',
      }
    },
  },
  plugins: [
    require('daisyui'),
  ],
}
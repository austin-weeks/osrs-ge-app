/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "*.html",
    "src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        "rs-primary": "var(--rs-primary)",
        "rs-medium": "var(--rs-medium)",
        "rs-border-light": "var(--rs-border-light)",
        "rs-border-dark": "var(--rs-border-light)"
      }
    },
    fontFamily: {
      sans: 'Runescape'
    }
  },
  plugins: [],
}


const { transform } = require('esbuild')

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
      },
      animation: {
        "runes-bounce": "bounce-delay 1.2s infinite",
        "runes-fade": "pulse 2.4s cubic-bezier(0.4, 0, 0.6, 1) infinite"
      },
      keyframes: {
        "bounce-delay": {
          '0%, 33%, 70%, 100%': {
            transform: 'translateY(0)',
            "animation-timing-function": "cubic-bezier(0, 0, 0.2, 1)"
          },
          "50%": {
            transform: 'translateY(-100%)',
            "animation-timing-function": "cubic-bezier(0.8, 0, 1, 1)"
          }
        },
        // "pulse-delay": {
        //   "0%, 100%": {
        //     opacity: 0.5
        //   },
        //   "50%": {
        //     opacity: 1
        //   }
        // }
      }
    },
    fontFamily: {
      sans: 'Runescape'
    }
  },
  plugins: [],
}


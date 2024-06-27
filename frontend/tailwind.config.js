/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        "input-check": {
          from: {
            scale: "0",
            rotate: "360deg"
          },
          to: {
            scale: "1",
            rotate: "0deg"
          }
        },
        "input-error": {
          "0%": {
            scale: "0",
            translate: "0.2rem 0 0"
          },
          "20%": {
            translate: "-0.2rem 0 0"
          },
          "40%": {
            translate: "0.2rem 0 0"
          },
          "60%": {
            translate: "-0.2rem 0 0"
          },
          "70%": {
            scale: "1"
          },
          "80%": {
            translate: "0.2rem 0 0"
          },
          "100%": {
            translate: "0 0 0"
          }
        },
        "login-success-box": {
          from: {
            opacity: "0"
          },
          to: {
            opacity: "1"
          }
        },
        "login-success-check": {
          "0%": {
            scale: "0",
            rotate: "360deg"
          },
          "75%": {
            scale: "1.1",
          },
          "100%": {
            scale: "1",
            rotate: "0deg"
          }
        },
        "login-success-title": {
          "0%": {
            marginTop: "-3.5rem",
            opacity: "0"
          },
          "25%": {
            marginTop: "-3.5rem"
          },
          "100%": {
            marginTop: "0",
            opacity: "1"
          }
        },
        "login-success-subtitle": {
          "0%": {
            opacity: "0"
          },
          "50%": {
            opacity: "0"
          },
          "100%": {
            opacity: "1"
          }
        },
        "width-load": {
          from: {
            width: "0%"
          },
          to: {
            width: "100%"
          }
        }
      },
      animation: {
        "input-check": "input-check 0.3s ease",
        "input-error": "input-error 0.3s ease",
        "login-success-box": "login-success-box 0.3s ease",
        "login-success-check": "login-success-check 0.5s ease",
        "login-success-title": "login-success-title 0.75s ease",
        "login-success-subtitle": "login-success-subtitle 1.25s ease",
        "width-load": "width-load var(--time) linear"
      }
    },
  },
  safelist: [
    'w-max', 'w-min', 'w-full', 'w-1/3',
    'text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl'
  ],
  plugins: []
}
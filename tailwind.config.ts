/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      keyframes: {
        "y-spin": {
          "0%": {
            transform: "rotateY(360deg)",
          },
          "100%": {
            transform: "rotateY(0deg)",
          },
        },
        "y-spin-back": {
          "0%": {
            transform: "rotateY(180deg)",
          },
          "100%": {
            transform: "rotateY(-180deg)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "flip-card": "y-spin 0.75s ease-out",
        "flip-card-back": "y-spin-back 0.75s ease-out",
      },
    },
  },
  plugins: [require("daisyui")],

  daisyui: {
    themes: ["autumn", "luxury"],
  },
};

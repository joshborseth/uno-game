/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      keyframes: {
        "y-spin": {
          "0%": {
            transform: "rotateY(360deg) translateY(-10rem)",
          },
          "100%": {
            transform: "rotateY(0deg) translateY(0rem)",
          },
        },
        "y-spin-back": {
          "0%": {
            transform: "rotateY(0deg) translateY(-10rem)",
          },
          "100%": {
            transform: "rotateY(-180deg) translateY(0rem)",
          },
        },
      },
      animation: {
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

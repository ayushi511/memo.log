/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      colors: {
        plum: "#8B6F9E",
        sage: "#9CAF88",
        rose: "#D8A7B1",
        butter: "#F3D98A",
        sky: "#A8CDE0",
        coral: "#E8A798",
        ink: "#3A2E42",
      },
      rotate: {
        "1.5": "1.5deg",
        "-1.5": "-1.5deg",
        "2.5": "2.5deg",
        "-2.5": "-2.5deg",
      },
    },
  },
  plugins: [],
};
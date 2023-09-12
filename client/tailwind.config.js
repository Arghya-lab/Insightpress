/** @type {import('tailwindcss').Config} */

import defaultTheme from "tailwindcss/defaultTheme";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        KeenyaCoffee: ["Keenya Coffee Rg", ...defaultTheme.fontFamily.serif],
        popins: ["Poppins", ...defaultTheme.fontFamily.serif],
        Roboto: ["Roboto", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [
    function ({ addVariant, e }) {
      addVariant("no-tailwind", ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `.${e(`no-tailwind${separator}${className}`)}`;
        });
      });
    },
  ],
};

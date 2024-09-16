/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite-react/lib/esm/**/*.js",
  ],
  theme: {
    extend: {
      backgroundImage: {
        cs: "linear-gradient(135deg, #020024 44%, #181c81 77%, #032133 93%, #0d0e51 100%)",
        cg: "linear-gradient(135deg, #000000 44%, #080530 77%, #080b5e 100%)",
      },
      boxShadow: {
        cs: "0px 6px 4px 2px #969696",
        btn: "inset rgba(0, 0, 0, .5) 0px 0px 7px 0px",
      },
      backgroundColor: {
        cs: "#272A2F",
      },
      dropShadow: {
        cs: "0px 6px 4px 2px #969696",
      },
      transitionProperty: {
        bgColor: "background-color",
      },
      colors: {
        inputback: "rgba(0, 0, 0, 0.25)",
        black4: "#6A7179",
      },
    },
  },
  plugins: [],
};

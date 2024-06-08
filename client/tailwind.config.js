/** @type {import('tailwindcss').Config} */

import typography from '@tailwindcss/typography';

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      xsm: '320px',
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px'
    },
    extend: {
      colors: {
        primaryBackground: "#2D3250",
        blueG: "rgba(96,163,230,1)",
        buttonFocus: "#5260B5",
        button: "#384283",
        secondaryBackground: "#424769"
      },
      fontFamily: {
        primary: ["'Lato'", 'sans-serif'],
        complementary: ["'Roboto'", 'sans-serif'],
        white: ["'Josefin Sans'", 'sans-serif'],
        secondary: ["'Poppins'", "sans-serif"],
        montser: ["'Montserrat'", "sans-serif"]
      }
    },
  },
  plugins: [typography],
};

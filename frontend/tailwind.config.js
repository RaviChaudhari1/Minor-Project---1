/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./index.html",
      "./src/**/*.{js,jsx,ts,tsx}", 
    ],
    darkMode: "class", 
    theme: {
      extend: {
        colors: {
          primary: {
            light: "#ffffff", // default light background
            dark: "#0a0a0a",  // dark background
          },
          secondary: {
            light: "#ca3500", // your accent for light theme
            dark: "#ff6a3d",  // accent variant for dark theme
          },
          gray: {
            light: "#f5f5f5",
            dark: "#1a1a1a",
          },
        },
      },
    },
    plugins: [],
  };
  


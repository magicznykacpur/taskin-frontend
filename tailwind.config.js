/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}", // Specify your template files
  ],
  theme: {
    extend: {
      colors: {
        primary: "#007bff", // Example: Custom primary color
        secondary: "#6c757d", // Example: Custom secondary color
      },
      fontFamily: {
        sans: ["Roboto", "sans-serif"], // Example: Custom font
      },
      spacing: {
        "2x": "2rem", // Example: Custom spacing
      },
    },
  },
  plugins: [],
};

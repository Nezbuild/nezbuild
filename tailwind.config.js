/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./index.html', './src/**/*.{jsx,js,ts,tsx}'], // Add paths to scan for Tailwind classes
    theme: {
      extend: {
        colors: {
          gold: '#FFD700',
          black: '#000000',
        },
        fontFamily: {
          display: ['Playfair Display', 'serif'],
          body: ['Poppins', 'sans-serif'],
        },
      },
    },
    plugins: [],
  };
  
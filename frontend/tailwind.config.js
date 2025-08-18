/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // This tells Tailwind to scan all files in your app and components folders.
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

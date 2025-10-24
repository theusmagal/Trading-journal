/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx,js,jsx,mdx}", "./components/**/*.{ts,tsx,js,jsx,mdx}"],
  theme: {
    extend: {
      boxShadow: {
        soft: "0 0 25px rgba(16,185,129,0.08)", 
      },
    },
  },
  plugins: [],
};

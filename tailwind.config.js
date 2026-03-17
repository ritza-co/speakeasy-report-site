/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Speakeasy brand tokens
        parchment: '#fafafa',          // speakeasy background
        ink:       '#000000',          // speakeasy text
        crimson:   '#c83228',          // speakeasy brand red (exact)
        'crimson-light': '#fb8841',    // speakeasy brand orange

        // Override stone scale with speakeasy neutrals
        stone: {
          50:  '#fafafa',
          100: '#f5f5f5',
          200: '#ebebeb',
          300: '#dbdbdb',
          400: '#bababa',
          500: '#969696',
          600: '#757575',
          700: '#545454',
          800: '#333333',
          850: '#242424',
          900: '#121212',
          950: '#0a0a0a',
        },
      },
    },
  },
  plugins: [],
}

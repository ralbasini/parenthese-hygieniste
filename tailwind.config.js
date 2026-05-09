/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js}'],
  theme: {
    extend: {
      colors: {
        'brand-brown':      '#A05C3B',
        'brand-brown-dark': '#5C3A28',
        'brand-cream':      '#F8F3EE',
        'brand-beige':      '#EDE4D8',
        'brand-purple':     '#8B7EC8',
      },
      fontFamily: {
        display: ['"Tan Mon Cheri"', '"Cormorant Garamond"', 'Georgia', 'serif'],
        seasons: ['"The Seasons"', '"Playfair Display"', 'Georgia', 'serif'],
        body:    ['"TT Chocolates"', '"DM Sans"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

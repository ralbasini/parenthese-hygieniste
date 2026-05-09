/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js}'],
  theme: {
    extend: {
      colors: {
        'brand-brown':      '#A05C3B',
        'brand-brown-dark': '#5C3A28',
        'brand-cream':      '#EAE8E5',
        'brand-beige':      '#D9D5CF',
        'brand-purple':     '#8B7EC8',
      },
      fontFamily: {
        display: ['"Bellota"', 'Georgia', 'serif'],
        seasons: ['"The Seasons"', '"Playfair Display"', 'Georgia', 'serif'],
        body:    ['"TT Chocolates"', '"DM Sans"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

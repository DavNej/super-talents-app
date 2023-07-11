/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    fontFamily: {
      'mona-sans': ['Mona-sans', 'sans-serif'],
    },
    extend: {
      colors: {
        white: '#FFFFFF',
        blue: '#3632FE',
        purple: '#8840FF',
        pink: '#FF22BB',
        gray: {
          900: '#060201',
        },
      },
      backgroundImage: {
        'sign-up': "url('/bg-signup.svg')",
      }
    },
  },
  plugins: [],
}

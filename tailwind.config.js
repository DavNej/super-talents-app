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
    colors: {},
    extend: {
      colors: {
        black: '#000000',
        white: '#FFFFFF',
        blue: '#3632FE',
        purple: '#8840FF',
        pink: '#FF22BB',
        gray: {
          100: '#F2F3F4',
          700: '#424242',
          900: '#060201',
        },
      },
      backgroundImage: {
        'sign-up': "url('/bg-signup.svg')",
        'avatar': "url('/bg-avatar.svg')",
      },
    },
  },
  plugins: [],
}

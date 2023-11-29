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
        transparent: 'transparent',
        black: '#000000',
        red: '#DC2626',
        white: '#FFFFFF',
        blue: '#3632FE',
        purple: {
          400: '#8840FF',
          500: '#5214D6',
        },
        pink: '#FF22BB',
        green: '#34D399',
        gray: {
          100: '#F2F3F4',
          400: '#A3A3A3',
          700: '#424242',
          800: '#232323',
          900: '#060201',
        },
      },
      backgroundImage: {
        'sign-up': "url('/bg-signup.svg')",
        common: "url('/bg-common.svg')",
      },
    },
  },
}

import defaultTheme from 'tailwindcss/defaultTheme'

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', ...defaultTheme.fontFamily.sans] },
      colors: { brand: { 500: '#F26D21', 600: '#de611c' } },
      borderRadius: { sm: '4px' },
    },
  },
  plugins: [],
}

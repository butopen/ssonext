module.exports = {
  mode: "jit",
  prefix: '',
  important: true,
  purge: {
    enabled: true,
    content: [
      './src/**/*.{html,ts,scss,js}',
    ]
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'primary': '#29ffad',
        'primary-400': '#29ffad',
        'primary-500': '#00ff9a',
        'primary-600': '#00e087',
        'primary-700': '#00c979',
        'primary-800': '#00965a',
        'primary-900': '#007246',
      },
      scale: {
        '200': '2',
        '300': '3'
      }
    },
  },
  variants: {
    extend: {},
  }
};

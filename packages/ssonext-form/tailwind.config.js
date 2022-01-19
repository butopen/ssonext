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
        'primary-200': '#007cff',
        'primary-300': '#2D9CFF',
        'primary': '#3294FB',
        'primary-400': '#3294FB',
        'primary-600': '#6BBAFF',
        'primary-900': '#3F3D56',
        'secondary-300': '#ff906d',
        'secondary': '#FB7F39',
        'secondary-500': '#ff6c18'
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

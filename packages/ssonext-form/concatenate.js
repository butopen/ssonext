const concat = require('concat');

concatenate = async () =>{
  const files = [
    './dist/ssonext-form/runtime.js',
    './dist/ssonext-form/polyfills.js',
    './dist/ssonext-form/main.js'
  ];

  await concat(files, 'dist/index.js');
}
concatenate();

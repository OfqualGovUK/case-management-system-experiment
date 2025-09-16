const path = require('path');
module.exports = {
  entry: 'js/ofqual-carbon.js',
  output: {
    filename: 'ofqual-carbon.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  //mode: 'production', // or 'development' while testing};
};

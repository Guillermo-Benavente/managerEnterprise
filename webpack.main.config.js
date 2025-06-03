const rules = require('./webpack.rules');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

rules.push({
  test: /\.js$/,
  exclude: /node_modules/,
  use: {
    loader: 'babel-loader',  // Usar Babel para compilar ES6
    options: {
      presets: ['@babel/preset-env'],
    },
  },
},
{
  test: /\.ts$/,
  exclude: /node_modules/,
  use: 'ts-loader'
});

module.exports = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: './src/main.js',
  // Put your normal webpack config below here
  module: {
    rules: rules,
  },
  resolve: {
    extensions: ['.js', '.ts', '.json'],
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/assets/icon.png', to: 'icon.png' }
      ]
    })
  ]
};

const rules = require('./webpack.rules');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
},
{
  test: /\.(png|jpg|gif|svg)$/,
  use: [
    {
      loader: 'file-loader',
      options: {
        name: '[name].[ext]',
        outputPath: 'assets/',
      },
    },
  ],
});

module.exports = {
  // Put your normal webpack config below here
  devtool: 'source-map',
  module: {
    rules,
  },
  resolve: {
    alias: {
      'Components': path.resolve(__dirname, './src/renderer/js/components'),
      'Types': path.resolve(__dirname, './src/renderer/js/types'),
      'Styles': path.resolve(__dirname, './src/renderer/css/styles'),
      'PagesCSS': path.resolve(__dirname, './src/renderer/css/pages'),
      'Assets': path.resolve(__dirname, './src/assets'),
      'Dictionary': path.resolve(__dirname, './public/dictionary'),
    },
    fallback: {
      "fs": false,
      "path": require.resolve("path-browserify"),
      crypto: require.resolve("crypto-browserify"),
      vm: require.resolve("vm-browserify"),
      stream: require.resolve("stream-browserify")
    }
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: './src/renderer/css', to: 'css' },
        { from: './src/assets', to: 'assets' },
        { from: './node_modules/datatables.net-dt/css/dataTables.dataTables.css', to: 'css/module' },
      ],
    }),
  ]
};

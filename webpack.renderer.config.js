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
    extensions: ['.js', '.jsx'],
    alias: {
      'Components': path.resolve(__dirname, './src/renderer/components'),
      'Pages': path.resolve(__dirname, './src/renderer/pages'),
      'Routes': path.resolve(__dirname, './src/renderer/routes'),
      'Schemas': path.resolve(__dirname, './src/renderer/schemas'),
      'Api': path.resolve(__dirname, './src/renderer/api'),
      'Util': path.resolve(__dirname, './src/renderer/util'),
      'Assets': path.resolve(__dirname, './src/renderer/assets'),
      'Types': path.resolve(__dirname, './src/types'),
    }
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: './node_modules/pdfjs-dist/build/pdf.worker.min.mjs', to: 'assets/workers' },
      ],
    }),
  ]
};



const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: ['./server/index.js'],
  output: {
    filename: './dist/server/index.js'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /node_modules/,
    }]
  },
  target: 'node',
  externals: [nodeExternals()],
  plugins: [
    new UglifyJSPlugin()
  ]
}

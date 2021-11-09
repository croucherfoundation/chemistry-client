const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');
const fs = require('fs');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  target: "web",
  optimization: {
    usedExports: true
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    hot: false,
    // inline: false,
    compress: true,
    port: 8080,
    historyApiFallback: {
      index: 'index.html'
    }
  },
});

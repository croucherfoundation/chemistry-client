var webpack = require('webpack');
var path = require('path');

const isDevelopment = true // process.env.NODE_ENV === 'development'
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const SVGSpritemapPlugin = require('svg-spritemap-webpack-plugin');

module.exports = {
  entry: {
    chemistry: './src/chemistry.js',
    demo: './src/demo.js',
  },
  plugins: [
    new webpack.ProvidePlugin({
      _: 'underscore',
      $: 'jquery',
      jQuery: 'jquery'
    }),
    new MiniCssExtractPlugin({
      filename: isDevelopment ? '[name].css' : '[name].[hash].css',
      chunkFilename: isDevelopment ? '[id].css' : '[id].[hash].css'
    }),
    new SVGSpritemapPlugin(
      'src/svg/*.svg',
      {
        output: {
          filename: "cms-sprites.svg"
        }
      }
    ),
    new SVGSpritemapPlugin(
      'src/svg_public/*.svg',
      {
        output: {
          filename: "public-sprites.svg"
        }
      }
    ),
    new CopyPlugin({
      patterns: [
        { from: 'src/*.html', to: "[name].html" },
        { from: 'src/images', to: 'images' },
      ]
    })
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    library: 'chemistry',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [
                '@babel/env',
              ]
            }
          },
          {
            loader: "eslint-loader"
          }
        ]
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader'
      },
      {
        test: /\.(css|sass|scss)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
              sourceMap: true
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: () => [
                  require('autoprefixer')
                ],
                sourceMap: true
              }
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.html?$/,
        exclude: /node_modules/,
        use: ['babel-loader', 'template-string-loader']
      },
      {
        test    : /\.(png|jpg|svg|gif)$/,
        loader  : 'url-loader',
        options: {
          limit: 8192
        }
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js', '.coffee', '.html'],
    alias: {
      Config: path.resolve(__dirname, 'src/cms/config/'),
      Utility: path.resolve(__dirname, 'src/cms/utility/'),
      Collections: path.resolve(__dirname, 'src/cms/collections/'),
      Models: path.resolve(__dirname, 'src/cms/models/'),
      Views: path.resolve(__dirname, 'src/cms/views/'),
      Templates: path.resolve(__dirname, 'src/cms/templates/'),
      Locales: path.resolve(__dirname, 'src/cms/locales/'),
      Sandbox: path.resolve(__dirname, 'src/cms/sandbox/'),
      Icons: path.resolve(__dirname, 'src/svg_icons/'),
      Images: path.resolve(__dirname, 'src/images/')
    }
  }
};

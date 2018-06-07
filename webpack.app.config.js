const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // for now we set one entry for the main package.json entry
  entry: {
    app: ['./app1.js'],
  },

  output: {
    path: path.resolve('dist'),
    filename: 'assets/[name].min.js',
  },

  devServer: {
    host: '0.0.0.0',
    disableHostCheck: true,
    port: 8888,
  },

  // resolve files
  // we reference a bunch of files in the build tool
  // command dir is the project path
  resolve: {
    extensions: ['.js', '.css'],
    modules: ['./node_modules'],
    alias: {
      '@syr/bus': path.resolve(__dirname, 'src/index.js'),
    },
  },
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
      {
        test: /.js?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: [
            [
              'env',
              {
                targets: {
                  browsers: ['Android >= 4', 'safari >= 7'],
                  uglify: true,
                },
              },
            ],
          ],
        },
      },
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'file-loader?name=images/[name].[ext]',
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      inject: false,
      title: 'Test Fixture',
      mobile: true,
      template: require('html-webpack-template'),
      links: [],
    }),
  ],
};

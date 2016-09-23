var path = require('path')
var webpack = require('webpack')
// var ExtractTextPlugin = require('extract-text-webpack-plugin')


const config = {
  devtool: 'inline-source-map',
  entry: [
    './index.js',
  ],
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'bundle.js',
  },
  plugins: [
  ],
  resolve: {
    extensions: ['', '.js', '.jsx'],
    alias: {
      sinon: 'sinon/pkg/sinon',
    },
  },
  module: {
    noParse: [
      /node_modules\/nedb\/node_modules\/localforage/,
      /node_modules\/sinon\//,
    ],
    loaders: [
      {
        test: /sinon\/pkg\/sinon\.js/,
        loader: 'legacy!imports?define=>false,require=>false',
      },
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        include: __dirname,
        query: {
          presets: ['react-hmre'],
        },
      },
      {
        test: /\.scss$/,
        loaders: ['style', 'css', 'sass'],
      },
      // {
      //   test: /\.scss$/,
      //   loader: ExtractTextPlugin.extract('css!sass'),
      // },
    ],
  },
  externals: {
    'react/addons': true,
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': true,
  },

}

if (process.env.NODE_ENV === 'production') {
  config.plugins.unshift(new webpack.optimize.DedupePlugin())
  config.plugins.push(new webpack.optimize.UglifyJsPlugin())

  config.module.loaders[0].query.presets.splice(0, 1, 'react')
}
else {
  config.plugins.push(new webpack.HotModuleReplacementPlugin())

  config.entry.unshift('webpack-hot-middleware/client')
}


module.exports = config

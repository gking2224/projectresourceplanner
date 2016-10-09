var path = require('path')
var webpack = require('webpack')
// var ExtractTextPlugin = require('extract-text-webpack-plugin')

const environment=process.env.NODE_ENV

console.log(environment)
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
    xmlhttprequest: '{XMLHttpRequest:XMLHttpRequest}',
  },

}

if (process.env.NODE_ENV === 'production') {
  config.plugins.unshift(new webpack.optimize.DedupePlugin())
  config.plugins.push(new webpack.optimize.UglifyJsPlugin())

  // remove react plugin in production
  config.module.loaders[0].query.presets.splice(0, 1, 'react')
  config.plugins.push(new webpack.DefinePlugin({'process.env': {'NODE_ENV': '"production"'}}))
}
else {
  config.plugins.push(new webpack.HotModuleReplacementPlugin())

  config.entry.unshift('webpack-hot-middleware/client')
}
// this doesn't seem to work - can't get dynamic variable process.env.NODE_ENV into define plugin as string literal
if (process.env.NODE_ENV === 'production')
  config.plugins.push(new webpack.DefinePlugin({'process.env': {'NODE_ENV': '"production"'}}))
if (process.env.NODE_ENV === 'dev')
  config.plugins.push(new webpack.DefinePlugin({'process.env': {'NODE_ENV': '"dev"'}}))
if (process.env.NODE_ENV === 'test')
  config.plugins.push(new webpack.DefinePlugin({'process.env': {'NODE_ENV': '"test"'}}))
if (process.env.NODE_ENV === 'uat')
  config.plugins.push(new webpack.DefinePlugin({'process.env': {'NODE_ENV': '"uat"'}}))


module.exports = config

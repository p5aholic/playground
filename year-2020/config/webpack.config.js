const path = require('path')

const SRC_PATH    = path.resolve(__dirname, '../src')
const PUBLIC_PATH = path.resolve(__dirname, '../public')

module.exports = {
  entry: {
    main: SRC_PATH + '/js/main.js'
  },

  output: {
    filename: '[name].js',
    path: PUBLIC_PATH + '/js/'
  },

  resolve: {
    alias: {
      Root: SRC_PATH + '/js/',
      Util: SRC_PATH + '/js/_utils/'
    }
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          configFile: path.resolve(__dirname, '../.babelrc')
        },
      },
      {
        test: /\.glsl$/,
        loader: 'webpack-glsl-loader'
      }
    ]
  },

  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /node_modules/,
          name: 'vendor',
          chunks: 'initial',
          enforce: true
        }
      }
    }
  }
}

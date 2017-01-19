module.exports = {
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['latest']
        }
      }
    ]
  },
  entry: {
    'eg-renderer': './src/index.js'
  },
  output: {
    path: './public',
    filename: '[name].js'
  },
  externals: {
    'd3': 'd3'
  }
}

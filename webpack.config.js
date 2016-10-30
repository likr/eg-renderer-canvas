module.exports = {
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          presets: ['latest'],
          plugins: ['transform-react-jsx']
        }
      }
    ]
  },
  entry: {
    'my-hello': './src/my-hello.js'
  },
  output: {
    path: './public',
    filename: '[name].js'
  },
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM'
  }
}

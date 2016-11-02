module.exports = {
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['latest'],
          plugins: ['transform-react-jsx']
        }
      }
    ]
  },
  entry: {
    'my-hello': './src/my-hello.js',
    'eg-renderer': './src/eg-renderer/index.js'
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

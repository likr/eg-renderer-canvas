const path = require('path')

const options = {
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, 'src')
        ],
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['env']
            }
          }
        ]
      }
    ]
  },
  entry: {
    'eg-renderer': './src/index'
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: '[name].js'
  },
  plugins: [
  ],
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    historyApiFallback: true,
    port: 8083
  }
}

if (process.env.NODE_ENV !== 'production') {
  Object.assign(options, {
    devtool: 'inline-source-map'
  })
}

module.exports = options

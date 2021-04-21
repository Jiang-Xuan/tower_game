const path = require('path');

exports.default = {
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: '/\\.js$/',
        exclude: '/node_modules/',
        loader: 'babel-loader',
      },
      {
        test: '/\\.(less|css)$/',
        use: [
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'less-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
    ],
  },
  entry: './src/index',
  output: {
    filename: '[name].js',
    chunkFilename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'development',
};

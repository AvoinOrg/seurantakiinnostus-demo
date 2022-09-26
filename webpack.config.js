const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const APP_PATH = path.resolve(__dirname, 'src');

console.log(APP_PATH);

module.exports = {
  entry: {
    index: APP_PATH + '/index.tsx',
    // , data: APP_PATH + '/data/jarvet.json'
  },

  output: {
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },

  devServer: {
    historyApiFallback: true,
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
    alias: {
      Utilities: path.resolve(__dirname, 'src/utilities/'),
      Constants: path.resolve(__dirname, 'src/constants/'),
      Components: path.resolve(__dirname, 'src/components/'),
      Assets: path.resolve(__dirname, 'src/assets/'),
      Styles: path.resolve(__dirname, 'src/styles/'),
    },
  },

  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        loader: 'babel-loader',
        exclude: [
          path.resolve(__dirname, 'node_modules'),
          path.resolve(__dirname, 'src/assets'),
        ],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(jpe?g|gif|png|svg|ttf|woff2?)$/i,
        type: 'asset/inline',
      },
      {
        test: /\.(js)$/,
        type: 'asset/resource',
        include: path.resolve(__dirname, 'src/assets'),
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: path.join(APP_PATH, 'index.html'),
    }),
    new ForkTsCheckerWebpackPlugin(),
  ],
};

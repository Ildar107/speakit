const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
console.log(__dirname)
module.exports = {
  entry: './src/main.jsx',
  context: path.resolve(__dirname),
  devtool: 'eval-source-map',

  resolve: {
    extensions: ['.jsx', '.js'],
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: '/',
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)?$/,
        use: ['babel-loader'],
        exclude: /node_modules/,
      },
      // {
      //   enforce: 'pre',
      //   test: /\.(js|jsx)$/,
      //   exclude: /node_modules/,
      //   loader: 'eslint-loader',
      //   options: {
      //     fix: true,
      //   },
      // },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },

  devServer: {
    contentBase: '/',
    port: 8181,
    historyApiFallback: true,
    inline: true,
    hot: true,
    open: true,
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    })
    // new CopyWebpackPlugin([
    //   {
    //     from: './src/assets/images/',
    //     to: './images',
    //   },
    //   {
    //     from: './src/assets/locales/',
    //     to: './locales',
    //   },
    //]),
  ],
};

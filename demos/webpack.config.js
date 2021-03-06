const path = require('path');
const webpack = require('webpack');
const precss = require('precss');
const autoprefixer = require('autoprefixer');

const config = {
  entry: [path.join(__dirname, 'src/index')],
  output: { path: path.join(__dirname, 'dist'), filename: 'bundle.js' },
  devtool: 'eval',
  module: {
    rules: [
      { test: /\.js$/, use: ['babel-loader'], exclude: /node_modules/ },
      { test: /\.css$/, use: ['style-loader', 'css-loader', 'postcss-loader'] },
      { test: /\.(glsl|frag|vert)$/, use: ['raw-loader', 'glslify-loader'], exclude: /node_modules/ }
    ]
  },
  plugins: [new webpack.LoaderOptionsPlugin({ options: { context: __dirname, postcss: [precss, autoprefixer] } })]
};

// NODE_ENV defaults to 'development'
if (process.env.NODE_ENV === 'production') {
  config.devtool = 'cheap-module-source-map';
  config.plugins = config.plugins.concat([
    new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify('production') }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: { screw_ie8: true, warnings: false },
      mangle: { screw_ie8: true },
      output: { comments: false, screw_ie8: true }
    })
  ]);
} else {
  config.plugins = config.plugins.concat([
    new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify('development') })
  ]);
}

module.exports = config;

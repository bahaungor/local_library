const path = require('path');

module.exports = {
  mode: 'development', // development→production before build
  entry: './src/app.js',
  devtool: 'inline-source-map', //Simplfy tracking errors
  output: {
    filename: 'server.js', // Output name of JS bundles
    path: path.resolve(__dirname, 'dist'), // Output dir
  },
  target: 'node',
  externals: {
    "express": "require('express')" //Supress express warning
  },
};
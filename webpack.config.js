var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, './build');
var APP_DIR = path.resolve(__dirname, './views');

const config = {
    devServer: {
      port: 3002,
      historyApiFallback: true
    },
   mode: 'development',
   entry: {
     main: APP_DIR + '/index.js'
   },
   output: {
     filename: 'bundle.js',
     path: BUILD_DIR,
   },
   module: {
    rules: [
     {
       test: /(\.css|.scss)$/,
       use: [{
           loader: "style-loader" // creates style nodes from JS strings
       }, {
           loader: "css-loader" // translates CSS into CommonJS
       }, {
           loader: "sass-loader" // compiles Sass to CSS
       }]
     },
     {
       test: /\.(jsx|js)?$/,
       use: [{
         loader: "babel-loader",
         options: {
           cacheDirectory: true,
           presets: ['react', 'es2015'], // Transpiles JSX and ES6
           plugins: ["transform-object-rest-spread"]
         }
       }]
     },
     {
      test: /\.(jpe?g|png|gif|svg|eot|ttf|woff)/,
      loader: "file-loader"
     }
    ],

  }
};

module.exports = config;
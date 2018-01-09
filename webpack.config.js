const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  entry: {
    bundle: path.resolve(__dirname, 'src/js/app.js')
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[hash].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|dist|vendors)/,
        use:[
          {
            loader: 'babel-loader',
            options: {
              presets: ['babel-preset-env']
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: "css-loader"
        })
      },
      {
        test: /\.styl$/,
        use: ExtractTextPlugin.extract({
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: true
              }
            },
            {
              loader: 'stylus-loader',
              options: {
                use: [
                  require('nib')
                ],
                import: [
                  '~nib/lib/nib/index.styl'
                ]
              }
            }
          ]
        })
      },
      {
        test: /\.html$/,
        use: [{
          loader: 'html-loader',
          options: {
            minimize: true
          }
        }]
      },
      {
        test: /\.(jpg|png|gif|woff|eot|ttf)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 5000,
          }
        }
      },
      {
        test: /\.(jpg|png|gif|svg)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'img/[name].[ext]'
          }
        }
      },
      {
        test: /\.(mp4|avi)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 1000000,
            name: 'videos/[name].[hash].[ext]'
          }
        }
      },
      {
        test: /\.json$/,
        use: 'json-loader'
      }
    ]
  },
  plugins: [
    new UglifyJsPlugin({
      exclude: /(node_modules|dist)/,
      parallel: true,
      uglifyOptions: {
        mangle: false,
        compress: true
      }
    }),
    new webpack.ProvidePlugin({
      $: 'jquery'
    }),
    new ExtractTextPlugin("[name].[hash].css"),
    //  title, es la variable que se se sustituyen en el index
    new HtmlWebpackPlugin({
      title: 'Nombre de App', //<title>
      template: 'src/index.html'
    })
  ],
  devServer: {
    contentBase: path.join(__dirname, "src"),
    compress: true
  }
}

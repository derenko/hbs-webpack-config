const path = require('path');
const fs = require("fs");

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

module.exports = (env) => {
  const isProduction = env.MODE === "production";

  return {
    mode: env.MODE,
    entry: ['./src/index.js', './src/index.scss'],
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.[hash].js',
      clean: true,
    },
    devServer: {
      static: {
        directory: path.join(__dirname, './src/public'),
      },
      compress: isProduction,
      port: 8080,
      hot: true,
      watchFiles:['src/**/*']
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new HtmlWebpackPlugin({
        template: "./src/index.hbs",
        inject: "body"
      }), 
      new MiniCssExtractPlugin({
        filename: isProduction ? '[name].[hash].css' : '[name].css'
      }),
      new CopyWebpackPlugin({
        patterns: [
          { from: "public/fonts", to: "fonts" },
          { from: "public/images", to: "images" }
        ]
      }),
    ],
    module: {
      rules: [
        {
          test: /\.scss$/,
          exclude: path.resolve(__dirname, 'node_modules'),
          use: [
            MiniCssExtractPlugin.loader,
            "css-loader",
            "sass-loader",
          ],
        },
        { 
          test: /\.hbs$/, 
          loader: "handlebars-loader",
          options: {
            runtime: path.resolve(__dirname, 'hbs-helpers/index.js'),
            precompileOptions: {
              knownHelpersOnly: false,
            }
          },
        }
      ],
    },
    optimization: {
      minimize: true,
      minimizer: [
        new CssMinimizerPlugin(),
        new TerserPlugin(),
        new ImageMinimizerPlugin({
          minimizer: {
            implementation: ImageMinimizerPlugin.squooshMinify,
            options: {
              // Your options for `squoosh`
            },
          },
        }),
      ],
    }
  }
};
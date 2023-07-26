const path = require("path");
const fs = require("fs");
const locations = require("./configuration/locations");

const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

module.exports = (env) => {
  const isProduction = env.MODE === "production";

  return {
    mode: env.MODE,
    devtool: "source-map",
    entry: {
      index: "./src/index.js",
    },
    output: {
      path: path.resolve(__dirname, "dist"),
      clean: true,
    },
    stats: "minimal",
    devServer: {
      static: {
        directory: locations.ASSETS,
      },
      compress: isProduction,
      port: 8080,
      hot: true,
      watchFiles: ["src/**/*"],
      open: true,
      host: "local-ip",
    },
    plugins: [
      ...locations.PAGES.map(
        (page) =>
          new HtmlWebpackPlugin({
            template: page.path,
            filename: page.name,
            inject: "body",
          })
      ),
      new CopyWebpackPlugin({
        patterns: [
          { from: locations.FONTS, to: "fonts" },
          { from: locations.IMAGES, to: "images" },
          { from: locations.FILES, to: "files" },
          { from: locations.SERVER, to: "server" },
        ],
      }),
      new MiniCssExtractPlugin({
        filename: "./css/[name].css",
      }),
    ],
    module: {
      rules: [
        {
          test: /\.(scss|css)$/,
          exclude: path.resolve(__dirname, "node_modules"),
          use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
        },
        {
          test: /\.hbs$/,
          loader: "handlebars-loader",
          options: {
            runtime: locations.CONFIGURATION_HBS,
            precompileOptions: {
              knownHelpersOnly: false,
            },
          },
        },
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
            options: {},
          },
        }),
      ],
    },
  };
};

const { InjectManifest } = require("workbox-webpack-plugin");
const webpack = require("webpack");

const webpackPlugins = [];
if (process.env.NODE_ENV === "production") {
  webpackPlugins.push(
    new InjectManifest({
      swSrc: "./src/service-worker.js",
      swDest: "service-worker.js"
    })
  );
}

module.exports = {
  transpileDependencies: ["vuetify"],
  configureWebpack: {
    plugins: webpackPlugins.concat(
      new webpack.DefinePlugin({
        COMMIT_HASH: JSON.stringify(process.env.GITHUB_SHA || "dev")
      }),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
    )
  },
  publicPath: process.env.BUID_CAP
    ? ""
    : process.env.NODE_ENV === "production"
    ? "/baby-log/"
    : "/"
};

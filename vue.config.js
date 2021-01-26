const { InjectManifest } = require("workbox-webpack-plugin");

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
    plugins: webpackPlugins
  },
  publicPath:
    process.env.NODE_ENV === "production" ? "/baby-log/" : "/"
};

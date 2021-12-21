/* eslint-disable */
const zopfli = require("@gfx/zopfli");
// const path = require("path");
// const glob = require("glob");
// const HtmlWebpackPlugin = require("html-webpack-plugin");
// const CompressionPlugin = require("compression-webpack-plugin");
// const ServiceWorkerWebpackPlugin = require("serviceworker-webpack-plugin");
// const path = require("path");

if (process.env.local) {
  process.env.VUE_APP_FRONTEND  = "https://tundra.ngrok.io";
  process.env.VUE_APP_BACKEND   = "https://fizz.ngrok.io";
} else if (process.env.NODE_ENV === "dev") {
  process.env.VUE_APP_FRONTEND  = "https://dev.example.com";
  process.env.VUE_APP_BACKEND   = "https://dev.example.com";
} else if (process.env.NODE_ENV === "production") {
  process.env.VUE_APP_FRONTEND  = "https://tundra.ngrok.io";
  process.env.VUE_APP_BACKEND   = "https://fizz.ngrok.io";
  // process.env.VUE_APP_FRONTEND  = "https://example.com";
  // process.env.VUE_APP_BACKEND   = "https://example.com";
}

module.exports = {
  devServer: {
    host: "localhost",
    public: "tundra.ngrok.io",
    disableHostCheck: true // Allow using ngrok with the frontend
  },

  // pwa: {
  //   name: "My App",
  //   themeColor: "#4DBA87",
  //   msTileColor: "#000000",
  //   appleMobileWebAppCapable: "yes",
  //   appleMobileWebAppStatusBarStyle: "black",

  //   // configure the workbox plugin
  //   workboxPluginMode: "InjectManifest",
  //   workboxOptions: {
  //     // swSrc is required in InjectManifest mode.
  //     swSrc: "dev/sw.js",
  //     // ...other Workbox options...
  //   }
  // }

  // pwa: {
  //   name: "TemplateProject",
  //   themeColor: "#821191",
  //   msTileColor: "#821191",
  //   appleMobileWebAppCapable: "no",
  //   appleMobileWebAppStatusBarStyle: "default",
  //   workboxPluginMode: "InjectManifest",
  //   manifestPath: "./src/publdsffdssdic/manifest.json",
  //   // workboxPluginMode: "GenerateSW",
  //   skipWaiting: true,
  //   manifestOptions: {
  //     name: "TemplateProject",
  //     short_name: "TemplateProject",
  //     start_url: "./",
  //     display: "standalone",
  //     theme_color: "#821191"
  //     // ,icons: [
  //     //   {
  //     //     src: "./favicon.svg",
  //     //     sizes: "512x512",
  //     //     type: "image/svg+xml",
  //     //     purpose: "any maskable",
  //     //   },
  //     // ],
  //   },
  //   workboxOptions: {
  //     // swSrc: "./src/public/service-worker.js", // Required in InjectManifest mode
  //     // navigateFallback: "index.html",
  //     exclude: [/_redirects/]
  //   }
  // },

  // pwa: {
  //   manifestOptions: {
  //     name: "TemplateProject",
  //     short_name: "TemplateProject",
  //     start_url: "./",
  //     display: "standalone",
  //     theme_color: "#821191"
  //   },
  //   name: "TemplateProject",
  //   themeColor: "#821191",
  //   msTileColor: "#821191",
  //   appleMobileWebAppCapable: "no",
  //   appleMobileWebAppStatusBarStyle: "default",
  //   skipWaiting: true,

  //   workboxPluginMode: "GenerateSW",
  //   // manifestPath: "./src/public/manifest.json",
  //   manifestPath: "./public/img/icons/manifest.json",
  //   workboxOptions: {
  //     // swSrc: "./src/public/service-worker.js",
  //     // swSrc: "./public/service-worker.js",
  //     navigateFallback: "index.html",
  //     exclude: [/_redirects/]
  //   }

  //   // workboxPluginMode: "InjectManifest",
  //   // manifestPath: "./src/public/manifest.json",
  //   // workboxOptions: {
  //   //   // swSrc: "./src/public/service-worker.js"
  //   //   swSrc: "./public/service-worker.js",
  //   //   // navigateFallback: "index.html",
  //   //   exclude: [/_redirects/]
  //   // }
  // },

  chainWebpack: (config) => {
    // Specify the location of the public directory
    config.plugin("html").tap((args) => {
      args[0].template = "./src/public/index.html";
      return args;
    });

    // TODO: Figure out what these do, and find the document page URL for them
    // config.plugins.delete("prefetch");
    // config.plugin("CompressionPlugin").use(CompressionPlugin);
    // config.performance.maxEntrypointSize(400000).maxAssetSize(400000);
  },
  configureWebpack: {
    mode: "production",
    devtool: false,
    performance: {
      hints: false
    },
    optimization: {
      nodeEnv: "production",
      minimize: true,
      splitChunks: {
        chunks: "async",
        minSize: 10000,
        maxSize: 100000,
        cacheGroups: {
          styles: {
            name: "styles",
            test: /\.css$/,
            chunks: "all",
            enforce: true
          },
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true
          }
        }
      }
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            // MiniCssExtractPlugin.loader,
            "css-loader"
          ]
        }
      ]
    },
    plugins: [
      // new CompressionPlugin(),

      // new HtmlWebpackPlugin({
      //   // https://github.com/jantimon/html-webpack-plugin#options
      //   title: "Does this work",
      //   publicPath: "./src/public",
      //   template: "./src/public/index.html",
      // }),

      // new ServiceWorkerWebpackPlugin({
      //   // entry: "./public/service-worker.js"
      //   entry: path.join(__dirname, "./public/service-worker.js")
      // })

      // new GenerateSW()

      // new CopyWebpackPlugin([{
      //   from: "./src/public", // from: "./frontend/public",
      //   to: ".",
      //   toType: "dir"
      // }]),

      // new CompressionPlugin()
    ]
  },
  pluginOptions: {
    compression:{
      zopfli: {
        compressionOptions: {
          numiterations: 15,
        },
        algorithm(input, compressionOptions, callback) {
          return zopfli.gzip(input, compressionOptions, callback);
        },
      }
    }
  }
}

const fs = require('fs');
const webpack = require('webpack');
const {VueBuilder, VueRender} = require('vue-builder');
const webpackDevMiddleware = require('koa-webpack-dev-middleware');
const webpackHotMiddleware = require('koa-webpack-hot-middleware');

// require('babel-polyfill');

/*
* A function for merging middlewares into one.
*/
// function combine(mids) {
//   return mids.reduce(function(a, b) {
//     return function(req, res, next) {
//       a(req, res, function(err) {
//         if (err) {
//           return next(err);
//         }
//         b(req, res, next);
//       });
//     };
//   });
// }

/*
* Vue.js development server middleware.
*/

// http://stackoverflow.com/questions/35196380/webpack-hot-middleware-with-koa-2-0
// "You can use koa-webpack-hot-middleware and wrap it with koa-convert"

const convert = require('koa-convert');
const compose = convert.compose || require('koa-compose');

// Convert koa legacy ( 0.x & 1.x ) generator middleware to modern promise middleware ( 2.x ).

exports.devServer = function ({server, client, verbose=false}={}) {
  let clientConfig = Object.assign({}, client);
  let serverConfig = Object.assign({}, server);

  let clientCompiler = webpack(clientConfig);
  let serverBuilder = new VueBuilder(serverConfig);

  return compose([
    convert(webpackDevMiddleware(clientCompiler, {
      noInfo: !verbose,
      publicPath: clientCompiler.options.output.publicPath
    })),
    convert(webpackHotMiddleware(clientCompiler, {
      serverSideRender: false,
      historyApiFallback: true
    })),
    async (ctx, next) => {
      let source = await serverBuilder.compile();
      this.vue = new VueRender({source});
      // await next();
    }
  ]);
}

/*
* Vue.js rendering utils middleware.
*/

exports.bundleRenderer = function ({bundlePath}={}) {
  let source = fs.readFileSync(bundlePath, 'utf8');
  let render = new VueRender({source});

  return async (ctx, next) => {
    this.vue = render;
    // await next();
  };
}

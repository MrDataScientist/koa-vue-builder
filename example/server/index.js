const koa = require('koa');
const {vueDevServer, vueBundleRenderer} = require('./middlewares/vue');

// const {appRender} = require('./middlewares/app');

const isProduction = process.env.NODE_ENV === 'production';

// const View = require('./view');
const HtmlWriter = require('./transform');

exports.createServer = function (host, port, cb) {
  let app = new koa();
  console.log(`Listening on ${host}:${port} ...`);

  if (isProduction) {
    app.use(vueBundleRenderer());
    console.log('middleware: vueBundleRenderer');
  }
  else {
    app.use(vueDevServer());
    console.log('middleware: vueDevServer');
  }

  // app.use(appRender());

  app.use(function async (ctx) {
    this.type = 'html';
    let stream = ctx.vue.renderToStream();
    let htmlWriter = new HtmlWriter(this);
    stream.pipe(htmlWriter).pipe(this.body);
  });


  console.log('middleware: appRender');

  return app.listen(port, host, cb);
};

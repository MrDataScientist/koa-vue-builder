const koa = require('koa');
const {vueDevServer, vueBundleRenderer} = require('./middlewares/vue');

// const {appRender} = require('./middlewares/app');

const isProduction = process.env.NODE_ENV === 'production';

// const View = require('./view');
const HtmlWriterStream = require('./html-writer-stream');

const router = require('koa-router')();

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
  console.log('configuring router');

  // See: https://github.com/alexmingoia/koa-router
  router.get('/', async (ctx, next) => {
    console.log('inside DEFAULT route /');

    this.type = 'html';
    let stream = ctx.vue.renderToStream();
    let htmlWriter = new HtmlWriterStream(this);

    console.log('piping html...');
    stream.pipe(htmlWriter).pipe(this.body);

    console.log('await next...');
    await next();
  });

  console.log('configure routes with allowed methods');

  app
    .use(router.routes())
    .use(router.allowedMethods());  

  console.log('middleware configured');

  return app.listen(port, host, cb);
};

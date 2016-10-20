const koa = require('koa');
const {vueDevServer, vueBundleRenderer} = require('./middlewares/vue');

// const {appRender} = require('./middlewares/app');

const isProduction = process.env.NODE_ENV === 'production';

// const View = require('./view');
const HtmlWriterStream = require('./html-writer-stream');

const router = require('koa-router')();

// For use with renderToString
// const Vue = require('vue');
// const vm = new Vue({
//   render (h) {
//     return h('div', 'hello')
//   }
// })

exports.createServer = function (host, port, cb) {
  let app = new koa();

  console.log(`Listening on ${host}:${port} ...`);

  if (isProduction) {
    app.use(vueBundleRenderer());
    // console.log('middleware: vueBundleRenderer added');
  }
  else {
    app.use(vueDevServer());
    // console.log('middleware: vueDevServer added');
  }

  // See writing a streaming response
  // http://stackoverflow.com/questions/28445382/writing-a-streaming-response-from-a-streaming-query-in-koa-with-mongoose

  // See: https://github.com/alexmingoia/koa-router
  router.get('/', async (ctx, next) => {
    ctx.type = 'html';
    if (ctx.vue) {
      let stream = ctx.vue.renderToStream();
      let htmlWriter = new HtmlWriterStream();
      ctx.body = stream.pipe(htmlWriter); 
    } else {
      console.log('no .vue object found on ctx. No SSR streaming possible :()');      
    }
    await next();
  });

  app
    .use(router.routes())
    .use(router.allowedMethods());  

  // console.log('all middleware configured');

  return app.listen(port, host, cb);
};

const koa = require('koa');
const router = require('koa-router')();

const { vueBundleRenderer } = require('./middlewares/vue');
const HtmlWriterStream = require('./html-writer-stream');

exports.createServer = function (host, port, cb) {
  let app = new koa();

  console.log(`Listening on ${host}:${port} ...`);

  app.use(vueBundleRenderer());

  // Writing a streaming response
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

  return app.listen(port, host, cb);
};

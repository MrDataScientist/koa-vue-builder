// @TJ You can assign this.body to an SSE stream and then send data to
// https://github.com/koajs/koa/issues/543

// Koa streaming
// stream-view: https://github.com/koajs/examples/tree/master/stream-view
// stream-server-side-events : https://github.com/koajs/examples/blob/master/stream-server-side-events/app.js

// ctx.vue.renderToStream()
  // renderToStream ({ctx, cache}={}) {
  //   let data = this.render.renderToStream(ctx); // Returns a Node.js readable stream.

  //   data.once('data', (chunk) => data.emit('init', ctx));

  //   return data;
  // }

exports.appRender = function() {
  return (ctx, next) => {
    var page = ctx.vue.renderToStream(ctx)

    res.write(`<!DOCTYPE html>`);
    page.on('init', () => {
      res.write(`<html lang="en">`);
      res.write(`<head>`);
      res.write(  `<meta charset="utf-8">`);
      res.write(  `<title>Example</title>`);
      res.write(  `<link href="/bundle.css" rel='stylesheet' type='text/css'>`);
      res.write(`</head>`);
      res.write(`<body>`);
    });
    page.on('data', (chunk) => {
      res.write(chunk);
    });
    page.on('end', () => {
      res.write(  `<script src="/bundle.js"></script>`);
      res.write(`</body>`);
      res.write(`</html>`);
      res.end();
    });
    page.on('error', function (error) {
      console.error(error);
      ctx.throw(500, 'Server Error');
    });
  }
};

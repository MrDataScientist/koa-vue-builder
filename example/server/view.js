const Readable = require('stream').Readable;
const co = require('co');

// See Node Streams guide: https://gist.github.com/joyrexus/10026630

module.exports = class View extends Readable {

  constructor(context, stream) {
    super();
    this.stream = stream; // ctx.vue.renderToStream(ctx)

    // stream.on('init'
    // stream.on('data'
    // stream.on('end'
    // stream.on('error'

    // render the view on a different loop
    co.call(this, this.render).catch(context.onerror);
  }

  _read() {}

  async render() {
    console.log('render');
    // push the <head> immediately
    this.push(`<!DOCTYPE html><html lang="en">
<head>
  <meta charset="utf-8">
  <title>Example</title>
  <link href="/bundle.css" rel='stylesheet' type='text/css'>
</head>`);

    console.log('pushed head');
    console.log('wait body');

    // render the <body> on the next tick
    await (chunk) => {
      this.push(chunk);
    };
    
    console.log('push body');

    this.push('<body>' + body + '</body>');

    console.log('push end');
    this.push(`<script src="/bundle.js"></script>
  </body>
</html>`);

    // end the stream
    this.push(null);
  };
};
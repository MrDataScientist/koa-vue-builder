var Transform = require("stream").Transform

module.exports = class HtmlWriter extends Transform { 
  constructor(ctx, options = {}) {
    super();
    this.options = options;
    // this.stream = ctx.vue.renderToStream(ctx);    
    this.content = [];
  }

  get isHead() {
    return this.content.length < 0;
  }

  head() {
    this.push(`<!DOCTYPE html><html lang="en">
<head>
  <meta charset="utf-8">
  <title>Example</title>
  <link href="/bundle.css" rel='stylesheet' type='text/css'>
</head><body>`);    
  }

  body(data) {
    this.push(data.toString());
  }

  footer() {
    this.push(this._lastLineData)
    this.push(`<script src="/bundle.js"></script>
  </body>
</html>`);

    // end the stream
    this.push(null);
  }

  _transform(chunk, encoding, done) {
      var data = chunk.toString()
      if (this._lastLineData) data = this._lastLineData + data

      this.isHead ? this.head() : this.body(data);
      done()
  }

  _flush(done) {
      if (this._lastLineData) this.footer();
      this._lastLineData = null
      done()
  }  
}
 
// // a simple transform stream
// var tx = new ToUpper;

// // a simple source stream
// var Readable = require('stream').Readable;
// var rs = new Readable;
// rs.push('the quick brown fox ');
// rs.push('jumps over the lazy dog.\n');
// rs.push(null);

// // pipe to response body
// rs.pipe(tx).pipe(this.body);
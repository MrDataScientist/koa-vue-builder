const path = require('path');
const fs = require('fs');
const {VueRender} = require('vue-builder');

/*
* Vue.js rendering utils middleware.
*/

exports.bundleRenderer = function (bundlePath, options = {}) {
  let source = fs.readFileSync(path.resolve(bundlePath), 'utf8');
  let render = new VueRender(source, options);

  return async (ctx, next) => {
    console.log('bundleRenderer: add VueRender to .vue on ctx');
    ctx.vue = render;
    await next();
  };
}

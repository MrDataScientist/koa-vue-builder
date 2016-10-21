# Koa Vue builder

Forked from [express-vue-builder](https://github.com/xpepermint/express-vue-builder)

> Vue.js server-side rendering middleware for Koa.js (Koa 2)

This package provides production-ready server-side [Vue.js](http://vuejs.org) application rendering middleware for [Koa 2](http://koajs.com). It creates a new instance of [VueRender](https://github.com/xpepermint/vue-builder#api) class (provided by the [vue-builder](https://github.com/xpepermint/vue-builder) dependency) and sets it on the context object as `ctx.vue`.

This is an open source package for [Vue.js](http://vuejs.org/) and [Koa 2](http://koajs.com). 
The source code is available in a [github repo](https://github.com/kristianmandrup/koa-vue-builder) where you can also find the [issue tracker](https://github.com/kristianmandrup/koa-vue-builder/issues).

## Related Projects

* [vue-webpack](https://github.com/xpepermint/vue-webpack): Webpack configuration object generator for Vue.js.
* [vue-builder](https://github.com/xpepermint/vue-builder): Server-side and client-side rendering for Vue.js.
* [express-vue-builder](https://github.com/xpepermint/express-vue-builder) Vue builder for Express.js  
* [express-vue-dev](https://github.com/xpepermint/express-vue-dev): Vue.js development server middleware for Express.js.
* [vue-cli-template](https://github.com/xpepermint/vue-cli-template): A simple server-side rendering CLI template for Vue.js.

## Install

Run the command below to install the package.

```
$ npm install --save-dev koa-vue-builder vue-builder
```

## Usage

Before we deploy application in production, we need to compile our Vue.js application into a bundle. A bundle is simply a file holding application's source code. Because we would like to render application in browsers as well as on the server, we need to build two bundle files - one targeting browsers, the other targeting the server. Check the attached example on how to build a bundle. Check the documentation of the [vue-builder](https://github.com/xpepermint/vue-builder) package for details.

Once you've created the bundle file for server-side, you can create a middleware.

```js
const {bundleRenderer} = require('koa-vue-builder');

let middleware = bundleRenderer(`./dist/server/bundle.js`); // pass this to app.use() of your Koa application (see example below)
```

Check the included `./example` directory or run the `npm run example:start` command to start the sample application.

## API

**bundleRenderer(bundlePath, options)**

> Server-side rendering middleware for Vue.js application.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| bundlePath | String | Yes | - | Path to server-side application bundle.
| options | Object | No | - | [Renderer options](https://www.npmjs.com/package/vue-server-renderer#renderer-options).


Uses:
- [vue-builder](https://github.com/xpepermint/vue-builder)
- [vue-webpack](https://github.com/xpepermint/vue-webpack)

## Architecture

Works using a piped Transform stream assigned to the context body :)

```js
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
```

## TODO: Add more Koa Adapters

Please feel to fork and provide an adapter for Koa 1.x.

## Development

Please fork this repo and work from there, then send a PR for each improvement or feature added.

### Install/Run

Currently the npm scripts use `babel-node` to run the various node tasks (using `.babelrc` config).
The code uses async/await which is most suitable for Koa 2 integration. 
When Node 7.x is out, `babel-node` might not be (as) necessary!?

### Test

`npm test`

### Example app

*Build*

`npm run example:build`

*Run*

`npm run example:start`

Go to: `localhost:3000`

### License

MIT
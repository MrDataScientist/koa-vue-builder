# Koa Vue builder

Forked from [express-vue-builder](https://github.com/xpepermint/express-vue-builder)

Uses:
- [vue-builder](https://github.com/xpepermint/vue-builder)
- [vue-webpack](https://github.com/xpepermint/vue-webpack)

See [getting started with koa 2](https://www.smashingmagazine.com/2016/08/getting-started-koa-2-async-functions/)

## Status

After a long hard struggle it finally works perfectly, using a piped Transform stream :)
In the end it came down to this:

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

# Example app

See `/example/app`

## Webpack middleware

We are using Koa variants of webpack middleware

- [koa-webpack-dev-middleware](https://www.npmjs.com/package/koa-webpack-dev-middleware)
- [koa-webpack-hot-middleware](https://www.npmjs.com/package/koa-webpack-hot-middleware)

These middlewares are then wrapped using `convert` and `compose` in order to work with Koa2 async/await promises:

```js
const convert = require('koa-convert');
const compose = convert.compose;

// ...

return compose([
  convert(webpackDevMiddleware(clientCompiler, {
    //...
  }),
  convert(webpackHotMiddleware(clientCompiler, {
    //...
  }
  //...
]);    
```

## Koa Adapters

This library urrently only supports Koa 2.x
Please feel to fork and provide an adapter for Koa 1.x.

## Install/Run

Currently the npm scripts use `babel-node` to run the various node tasks (using `.babelrc` config).
When Node 7.x is out, this might not be necessary!?

## Test

`npm test`

## Example app

*Build*

`npm run example:build`

*Run*

`npm run example:start`

Go to: `localhost:3000`

## License

MIT
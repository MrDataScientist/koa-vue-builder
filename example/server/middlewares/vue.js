const {build} = require('vue-webpack');
const {devServer, bundleRenderer} = require('../../../src');

exports.vueDevServer = function(ctx, next) {
  // console.log('vueDevServer');

  return devServer({
    server: build({
      env: 'development',
      mode: 'server',
      inputFilePath: `${__dirname}/../../app/server-entry.js`,
      outputPath: `${__dirname}/../../../dist/server`
    }),
    client: build({
      env: 'development',
      mode: 'client',
      inputFilePath: `${__dirname}/../../app/client-entry.js`,
      outputPath: `${__dirname}/../../../dist/client`,
      publicPath: '/'
    })
  })
};

exports.vueBundleRenderer = function () {
  // console.log('vueBundleRenderer');

  return bundleRenderer({
    bundlePath: `${__dirname}/../../../dist/server/bundle.js`
  });
};

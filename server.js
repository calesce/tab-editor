/*eslint-disable no-console */
const path = require('path');
const express = require('express');
const webpack = require('webpack');
const config = require('./webpack.config.dev');
const devMiddleware = require('webpack-dev-middleware');

const app = express();
const compiler = webpack(config);

const devMiddleWareInstance = devMiddleware(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
});
app.use(devMiddleWareInstance);

app.use(require('webpack-hot-middleware')(compiler));

app.get('*', function(req, res, next) {
  const filename = path.join(compiler.outputPath, 'index.html');
  devMiddleWareInstance.waitUntilValid(() => {
    compiler.outputFileSystem.readFile(filename, function(err, result) {
      if (err) {
        return next(err);
      }
      res.set('content-type', 'text/html');
      res.send(result);
      res.end();
    });
  });
});

app.listen(3000, 'localhost', function(err) {
  if (err) {
    return console.log(err);
  }

  console.log('Listening at http://localhost:3000');
});

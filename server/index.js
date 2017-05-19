// import "babel-polyfill";
import "regenerator-runtime/runtime";

import mongoose from 'mongoose';
import config from './config/config';
import app from './config/express';

mongoose.Promise = Promise;

mongoose.connect(config.mongoUri, { server: { socketOptions: { keepAlive: 1 } } });
mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${mongoUri}`);
});

// print mongoose logs in dev env
// if (config.MONGOOSE_DEBUG) {
//   mongoose.set('debug', (collectionName, method, query, doc) => {
//     debug(`${collectionName}.${method}`, util.inspect(query, false, 20), doc);
//   });
// }

// module.parent check is required to support mocha watch
// src: https://github.com/mochajs/mocha/issues/1912
if (!module.parent) {
  app.listen(config.port || 3000, () => {
    console.info(`server started on port ${config.port} (${config.env})`); // eslint-disable-line no-console
  });
}

export default app;

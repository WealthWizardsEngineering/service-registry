require('dotenv').config({ silent: true });
const env = require('./src/env-vars');
const { app } = require('./src/server');
const logger = require('./src/logger');
const mongoose = require('mongoose');

mongoose.Promise = Promise;
const { mongooseConnectionErrorHandler } = require('ww-utils');

mongooseConnectionErrorHandler(logger, [mongoose.connection]);

const server = app.listen(env.PORT, () => {
  logger.inProdEnv(`Listening on port ${env.PORT} with context route of /service-registry`);
});

process.on('SIGTERM', () => {
  logger.inProdEnv('Shutting down...');
  server.close(() => app.shutdown());
});

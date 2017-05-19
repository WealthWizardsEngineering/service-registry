require('dotenv').config({ silent: true });
const env = require('./src/env-vars');
const { app } = require('./src/server');
const logger = require('./src/logger');

const server = app.listen(env.PORT, () => {
  logger.info(`Listening on port ${env.PORT} with context route of /service-registry`);
});

process.on('SIGTERM', () => {
  logger.info('Shutting down...');
  server.close(() => app.shutdown());
});

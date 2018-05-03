const cors = require('cors');
const nocache = require('nocache');

/**
* @param app {Application} the express application instance
* @param serviceContextRoute {String} optional param
*/
module.exports = (app, serviceContextRoute = '') => {
  let contextRoute = serviceContextRoute;
  if (contextRoute === '/') {
    contextRoute = '';
  }
  app.get(`${contextRoute}/ping`, cors(), nocache(), (req, res) => {
    res.json(
      {
        version: process.env.npm_package_version,
        name: process.env.npm_package_name,
      }
    );
  });
};

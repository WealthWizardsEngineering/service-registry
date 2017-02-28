const createService = require('./create-service');
const getService= require('./get-service');
const getServices = require('./get-services');
const updateService = require('./update-service');
const createServiceValidation = require('../rules/create-service-validation');
const queryStringValidation = require('../rules/querystring-validation');
const { requestValidator } = require('ww-validation');

module.exports = (app) => {
  app.post('/v1/service',
    requestValidator({ body: createServiceValidation }),
    createService
  );

  app.get('/v1/service',
    requestValidator({ query: queryStringValidation }),
    getServices
  );

  app.get('/v1/service/:id',
    requestValidator({ query: queryStringValidation }),
    getService
  );

  app.put('/v1/service/:id',
    requestValidator({ body: createServiceValidation }),
    updateService
  );
};

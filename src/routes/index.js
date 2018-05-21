const createService = require('./create-service');
const getHealth= require('./get-health');
const getPing= require('./get-ping');
const getService= require('./get-service');
const getServices = require('./get-services');
const updateService = require('./update-service');
const getTags = require('./get-tags');
const cors = require('cors');
const nocache = require('nocache');
const createServiceValidation = require('../rules/create-service-validation');
const queryStringValidation = require('../rules/querystring-validation');
const requestValidator  = require('../request-validator');

module.exports = (app) => {
  app.get('/ping',
    cors(),
    nocache(),
    getPing
  );

  app.get('/health',
    cors(),
    nocache(),
    getHealth
  );

  app.post('/v1/service',
    requestValidator({ body: createServiceValidation }),
    createService
  );

  app.get('/v1/service',
    requestValidator({ query: queryStringValidation }),
    cors(),
    getServices
  );

  app.get('/v1/service/:id',
    requestValidator({ query: queryStringValidation }),
    cors(),
    getService
  );

  app.put('/v1/service/:id',
    requestValidator({ body: createServiceValidation }),
    updateService
  );

  app.get('/v1/tag',
    cors(),
    getTags
  );

};

const ApiError = require('../api-error')
const ErrorCodes = require('../error-codes')
const createService = require('../db/service-creator');

module.exports = (req, res, next) => {
  createService(req.body)
    .then((result) => {
      res.status(201).location(req.originalUrl + '/' + result._id).send();
    })
    .catch((error) => {
      if (11000 === error.code) {
        next(new ApiError('The id already exists, try using PUT to update it', ErrorCodes.RESOURCE_EXISTS, 409));
      } else {
        next(new ApiError('Internal server error', ErrorCodes.INTERNAL_SERVER_ERROR, 500));
      }
    });
};

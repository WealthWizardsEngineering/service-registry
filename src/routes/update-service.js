const { ErrorCodes, ApiError } = require('ww-utils');
const updateService = require('../db/service-updater');

module.exports = (req, res, next) => {

  updateService(req.body)
    .then((result) => {
      if (result == null ) {
        res.status(201).send();
      } else {
        res.status(204).send();
      }
    })
    .catch(() => {
      next(new ApiError('Internal server error', ErrorCodes.INTERNAL_SERVER_ERROR, 500));
    });
};

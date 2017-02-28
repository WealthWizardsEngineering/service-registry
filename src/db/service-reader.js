const Service = require('./service-model');

const getServices = (query, projection) =>
  Service
    .find(query)
    .select(projection)
    .exec();

const getService = id =>
  Service
    .findById(id)
    .exec();

module.exports = {
  getServices,
  getService,
};

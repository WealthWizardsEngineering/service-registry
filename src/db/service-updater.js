const Service = require('./service-model');

module.exports = ({ _id, environments, links }) => {
  return Service.findOneAndUpdate(
    { _id: _id },
    { $set: { _id, environments, links } },
    { upsert: true, setDefaultsOnInsert: true }
  ).exec();
};

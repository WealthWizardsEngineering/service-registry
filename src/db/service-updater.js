const Service = require('./service-model');

module.exports = ({ _id, tags, environments, links }) => {
  return Service.findOneAndUpdate(
    { _id: _id },
    { $set: { _id, tags, environments, links } },
    { upsert: true, setDefaultsOnInsert: true }
  ).exec();
};

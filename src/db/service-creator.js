const Service = require('./service-model');

module.exports = ({ _id, environments, links }) => {
  const f = new Service({
    _id,
    environments,
    links,
  });

  return f.save();
};

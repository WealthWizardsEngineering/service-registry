const Service = require('./service-model');

module.exports = ({ _id, tags, environments, links }) => {
  const f = new Service({
    _id,
    tags,
    environments,
    links,
  });

  return f.save();
};

const { getServices } = require('../db/service-reader');
const { buildQuery, buildProjection } = require('../db/helpers');

const QUERY_WHITELIST = ['_id'];
const PROJECTION_WHITELIST = ['_id'];

module.exports = (req, res) => {

  const query = buildQuery(QUERY_WHITELIST)(req.query);
  const projection = buildProjection(PROJECTION_WHITELIST)(req.query.fields);

  getServices(query, projection)
    .then(results => {
      res.send(results);
    });

};

const { getService } = require('../db/service-reader');

module.exports = (req, res) => {

  getService(req.params.id)
    .then(service => {
      res.send(service);
    });

};

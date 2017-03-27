const { getTags } = require('../db/tag-reader');
module.exports = (req, res) => {

  getTags()
    .then(results => {
      if (results == null || results.length === 0) {
        res.send([]);
      }
      res.send(results[0].tags);
    });

};

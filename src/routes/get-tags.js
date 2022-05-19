const { getTags } = require('../db/tag-reader');
module.exports = (req, res) => {

  getTags()
    .then(results => {
      if (results && results.length > 0) {
        res.send(results[0].tags);
      }
      res.send([]);
    });

};

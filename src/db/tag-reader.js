const Service = require('./service-model');

const getTags = () =>
  Service
    .aggregate([
      {$unwind: "$tags"},
      {$group:{_id:null, tagSet: {$addToSet: "$tags"}}},
      {$project:{_id:0, tags: "$tagSet"}}
    ]).exec();



module.exports = {
  getTags,
};

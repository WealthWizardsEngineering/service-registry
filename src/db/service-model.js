const mongoose = require('mongoose');
mongoose.Promise = Promise;

const ServiceSchema = new mongoose.Schema({
  _id: { type: String },
  environments: [{
    name: {type: String},
    baseUrl: {type: String},
  }],
  links: [{
    name: {type: String},
    url: {type: String},
  }],
});

module.exports = mongoose.model('Service', ServiceSchema);

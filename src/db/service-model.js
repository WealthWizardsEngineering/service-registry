const mongoose = require('mongoose');
mongoose.Promise = Promise;

const ServiceSchema = new mongoose.Schema({
  _id: { type: String },
  tags: [
    { type: String }
  ],
  environments: [{
    _id: {type: String},
    baseUrl: {type: String},
  }],
  links: [{
    _id: {type: String},
    url: {type: String},
  }],
},{
  timestamps: true
});

module.exports = mongoose.model('Service', ServiceSchema);

const Joi = require('joi');

const environmentRules = Joi.object().keys({
  name: Joi.string().required(),
  baseUrl: Joi.string().uri({
    scheme: [
      'http',
      'https'
    ],
  }).required(),
});

const linkRules = Joi.object().keys({
  name: Joi.string().required(),
  url: Joi.string().uri({
    scheme: [
      'http',
      'https'
    ],
    allowRelative: true,
  }).required(),
});


const createValidationRules = Joi.object().keys({
  _id: Joi.string().required(),
  environments: Joi.array().items(environmentRules).optional(),
  links: Joi.array().items(linkRules).optional(),
});

module.exports = createValidationRules;

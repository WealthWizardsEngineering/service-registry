const Joi = require('joi');

const environmentRules = Joi.object().keys({
  _id: Joi.string().required(),
  baseUrl: Joi.string().uri({
    scheme: [
      'http',
      'https'
    ],
  }).required(),
});

const linkRules = Joi.object().keys({
  _id: Joi.string().required(),
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
  tags: Joi.array().items(Joi.string()).optional().allow(null),
  environments: Joi.array().items(environmentRules).optional().allow(null),
  links: Joi.array().items(linkRules).optional().allow(null),
});

module.exports = createValidationRules;

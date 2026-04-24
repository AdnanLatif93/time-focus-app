const Joi = require('joi');

module.exports = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow('').optional(),
  duration: Joi.number().integer().min(0).optional(),
  completed: Joi.boolean().optional(),
});

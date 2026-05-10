const Joi = require('joi');

const collegeQuerySchema = Joi.object({
  search: Joi.string().allow('').optional(),
  location: Joi.string().allow('').optional(),
  state: Joi.string().allow('').optional(),
  city: Joi.string().allow('').optional(),
  course: Joi.string().allow('').optional(),
  minFees: Joi.number().min(0).optional(),
  maxFees: Joi.number().min(0).optional(),
  page: Joi.number().min(1).optional(),
  limit: Joi.number().min(1).max(100).optional(),
});

module.exports = {
  collegeQuerySchema,
};

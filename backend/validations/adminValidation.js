const Joi = require('joi');

const collegeSchema = Joi.object({
  name: Joi.string().required(),
  location: Joi.string().required(),
  city: Joi.string().required(),
  state: Joi.string().required(),
  type: Joi.string().valid('Government', 'Private', 'Deemed', 'Autonomous').default('Private'),
  established: Joi.number().optional(),
  ranking: Joi.number().optional(),
  rating: Joi.number().min(0).max(5).default(0),
  overview: Joi.string().allow('').optional(),
  fees: Joi.object({
    min: Joi.number().min(0).default(0),
    max: Joi.number().min(0).default(0),
  }).optional(),
  courses: Joi.array().items(Joi.object({
    name: Joi.string().required(),
    duration: Joi.string().required(),
    fees: Joi.number().min(0).required(),
  })).optional(),
  placement: Joi.object({
    averagePackage: Joi.number().min(0).default(0),
    highestPackage: Joi.number().min(0).default(0),
    placementRate: Joi.number().min(0).max(100).default(0),
    topRecruiters: Joi.array().items(Joi.string()).optional(),
  }).optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  logo: Joi.string().allow('').optional(),
  image: Joi.string().allow('').optional(),
  bannerImage: Joi.string().allow('').optional(),
  cutoffs: Joi.array().items(Joi.object({
    exam: Joi.string().required(),
    rank: Joi.number().required(),
    year: Joi.number().default(2024),
  })).optional(),
});

module.exports = {
  collegeSchema,
};

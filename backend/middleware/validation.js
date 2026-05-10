const Joi = require('joi');

/**
 * Higher-order function that returns a Joi validation middleware.
 * @param {Joi.ObjectSchema} schema - The Joi schema to validate against.
 * @param {string} property - The property of req to validate (body, query, params).
 */
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property], {
      abortEarly: false, // Include all errors
      allowUnknown: true, // Allow unknown fields for now
      stripUnknown: true, // Remove unknown fields from the result
    });

    if (error) {
      const errorMessage = error.details.map((detail) => detail.message).join(', ');
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: errorMessage,
      });
    }

    // Update req[property] with the validated and stripped value
    next();
  };
};

module.exports = validate;

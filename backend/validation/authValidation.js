// backend/validation/authValidation.js
const Joi = require('joi');

const registerSchema = Joi.object({
  username: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(128).required(),
});

const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().min(8).max(128).required(),
});

module.exports = {
  registerSchema,
  loginSchema,
};

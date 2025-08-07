const Joi = require('joi');

// Login validation schema
const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
    'string.empty': 'Email cannot be empty'
  }),
  password: Joi.string().min(6).max(128).required().messages({
    'string.min': 'Password must be at least 6 characters long',
    'string.max': 'Password cannot exceed 128 characters',
    'any.required': 'Password is required',
    'string.empty': 'Password cannot be empty'
  })
});

// Admin registration validation schema
const adminRegistrationSchema = Joi.object({
  name: Joi.string().min(2).max(50).trim().required().messages({
    'string.min': 'Name must be at least 2 characters long',
    'string.max': 'Name cannot exceed 50 characters',
    'any.required': 'Name is required',
    'string.empty': 'Name cannot be empty'
  }),
  email: Joi.string().email().lowercase().trim().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
    'string.empty': 'Email cannot be empty'
  }),
  password: Joi.string().min(6).max(128).required().messages({
    'string.min': 'Password must be at least 6 characters long',
    'string.max': 'Password cannot exceed 128 characters',
    'any.required': 'Password is required',
    'string.empty': 'Password cannot be empty'
  }),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
    'any.only': 'Passwords must match',
    'any.required': 'Password confirmation is required'
  })
});

// Create seller validation schema
const createSellerSchema = Joi.object({
  name: Joi.string().min(2).max(50).trim().required().messages({
    'string.min': 'Name must be at least 2 characters long',
    'string.max': 'Name cannot exceed 50 characters',
    'any.required': 'Name is required',
    'string.empty': 'Name cannot be empty'
  }),
  email: Joi.string().email().lowercase().trim().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
    'string.empty': 'Email cannot be empty'
  }),
  mobile: Joi.string().pattern(/^[0-9]{10}$/).required().messages({
    'string.pattern.base': 'Mobile number must be exactly 10 digits',
    'any.required': 'Mobile number is required',
    'string.empty': 'Mobile number cannot be empty'
  }),
  country: Joi.string().min(2).max(50).trim().required().messages({
    'string.min': 'Country must be at least 2 characters long',
    'string.max': 'Country cannot exceed 50 characters',
    'any.required': 'Country is required',
    'string.empty': 'Country cannot be empty'
  }),
  state: Joi.string().min(2).max(50).trim().required().messages({
    'string.min': 'State must be at least 2 characters long',
    'string.max': 'State cannot exceed 50 characters',
    'any.required': 'State is required',
    'string.empty': 'State cannot be empty'
  }),
  skills: Joi.string().min(5).max(200).trim().required().messages({
    'string.min': 'Skills must be at least 5 characters long',
    'string.max': 'Skills cannot exceed 200 characters',
    'any.required': 'Skills are required',
    'string.empty': 'Skills cannot be empty'
  }),
  password: Joi.string().min(6).max(128).required().messages({
    'string.min': 'Password must be at least 6 characters long',
    'string.max': 'Password cannot exceed 128 characters',
    'any.required': 'Password is required',
    'string.empty': 'Password cannot be empty'
  })
});

// Pagination query validation schema
const paginationQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1).messages({
    'number.base': 'Page must be a number',
    'number.integer': 'Page must be an integer',
    'number.min': 'Page must be at least 1'
  }),
  limit: Joi.number().integer().min(1).max(100).default(10).messages({
    'number.base': 'Limit must be a number',
    'number.integer': 'Limit must be an integer',
    'number.min': 'Limit must be at least 1',
    'number.max': 'Limit cannot exceed 100'
  })
});

// Route parameter validation schema
const idParamSchema = Joi.object({
  id: Joi.number().integer().positive().required().messages({
    'number.base': 'ID must be a number',
    'number.integer': 'ID must be an integer',
    'number.positive': 'ID must be positive',
    'any.required': 'ID is required'
  })
});

module.exports = {
  loginSchema,
  adminRegistrationSchema,
  createSellerSchema,
  paginationQuerySchema,
  idParamSchema
};

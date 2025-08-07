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

// Brand validation schema (matches Brand model)
const brandSchema = Joi.object({
  name: Joi.string().min(2).max(50).trim().required().messages({
    'string.min': 'Brand name must be at least 2 characters long',
    'string.max': 'Brand name cannot exceed 50 characters',
    'any.required': 'Brand name is required',
    'string.empty': 'Brand name cannot be empty'
  }),
  detail: Joi.string().min(5).max(200).trim().required().messages({
    'string.min': 'Brand detail must be at least 5 characters long',
    'string.max': 'Brand detail cannot exceed 200 characters',
    'any.required': 'Brand detail is required',
    'string.empty': 'Brand detail cannot be empty'
  }),
  image: Joi.string().required().messages({
    'any.required': 'Brand image is required',
    'string.empty': 'Brand image cannot be empty'
  }),
  price: Joi.number().positive().precision(2).max(999999.99).required().messages({
    'number.base': 'Price must be a number',
    'number.positive': 'Price must be positive',
    'number.precision': 'Price can have maximum 2 decimal places',
    'number.max': 'Price cannot exceed 999,999.99',
    'any.required': 'Price is required'
  }),
  productId: Joi.number().integer().positive().required().messages({
    'number.base': 'Product ID must be a number',
    'number.integer': 'Product ID must be an integer',
    'number.positive': 'Product ID must be positive',
    'any.required': 'Product ID is required'
  })
});

// Add product validation schema (only product fields, no brands)
const addProductSchema = Joi.object({
  name: Joi.string().min(2).max(100).trim().required().messages({
    'string.min': 'Product name must be at least 2 characters long',
    'string.max': 'Product name cannot exceed 100 characters',
    'any.required': 'Product name is required',
    'string.empty': 'Product name cannot be empty'
  }),
  description: Joi.string().min(10).max(500).trim().required().messages({
    'string.min': 'Description must be at least 10 characters long',
    'string.max': 'Description cannot exceed 500 characters',
    'any.required': 'Description is required',
    'string.empty': 'Description cannot be empty'
  })
});

// Add brand(s) validation schema (for adding brands to existing products)
const addBrandSchema = Joi.object({
  brands: Joi.array().items(brandSchema).min(1).max(10).required().messages({
    'array.min': 'At least one brand is required',
    'array.max': 'Cannot exceed 10 brands per product',
    'any.required': 'Brands are required'
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

// File upload validation schema (for multer)
const fileUploadSchema = Joi.object({
  files: Joi.array().items(
    Joi.object({
      fieldname: Joi.string().valid('brandImages').required(),
      originalname: Joi.string().required(),
      encoding: Joi.string().required(),
      mimetype: Joi.string().pattern(/^image\/(jpeg|jpg|png|gif|webp)$/).required(),
      size: Joi.number().max(5 * 1024 * 1024).required() // 5MB max
    })
  ).optional()
});

module.exports = {
  loginSchema,
  addProductSchema,
  addBrandSchema,
  brandSchema,
  paginationQuerySchema,
  idParamSchema,
  fileUploadSchema
};

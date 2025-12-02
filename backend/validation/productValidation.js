// validation/productValidation.js
const Joi = require('joi');

// Pour création / mise à jour complète d’un produit
const productSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  description: Joi.string().min(5).max(1000).required(),
  price: Joi.number().precision(2).positive().required(),
  stock: Joi.number().integer().min(0).required(),
});

// Pour la route PUT /:productId/stock
const updateStockSchema = Joi.object({
  stock: Joi.number()
    .integer()
    .min(0)
    .required(),
});

module.exports = {
  productSchema,
  updateStockSchema,
};

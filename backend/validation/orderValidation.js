// backend/validation/orderValidation.js
const Joi = require('joi');

// Validation d'un item de commande
const orderItemSchema = Joi.object({
  productId: Joi.string()
    .required(), // on pourrait raffiner avec une regex ObjectId si tu veux
  quantity: Joi.number()
    .integer()
    .min(1)
    .required(),
  price: Joi.number()
    .positive()
    .required(),
});

// Validation de l'adresse de livraison
const shippingAddressSchema = Joi.object({
  street: Joi.string().min(3).max(255).required(),
  city: Joi.string().min(2).max(100).required(),
  postalCode: Joi.string().min(3).max(20).required(),
  country: Joi.string().min(2).max(100).required(),
});

// Schéma pour la création de commande (POST /api/orders)
const createOrderSchema = Joi.object({
  items: Joi.array()
    .items(orderItemSchema)
    .min(1)
    .required(),

  total: Joi.number()
    .positive()
    .required(),

  shippingAddress: shippingAddressSchema.required(),

  paymentMethod: Joi.string()
    .valid('Carte bancaire', 'PayPal', 'Virement')
    .required(),

  shippingMethod: Joi.string()
    .valid('colissimo', 'chronopost')
    .required(),

  // On empêche le client de définir le statut lui-même à la création
  status: Joi.forbidden(),
});

// Schéma pour la mise à jour du statut (PUT /:orderId/status)
const updateOrderStatusSchema = Joi.object({
  status: Joi.string()
    .valid('En attente', 'En cours de traitement', 'Expédiée', 'Délivrée', 'Annulée')
    .required(),
});

module.exports = {
  createOrderSchema,
  updateOrderStatusSchema,
};

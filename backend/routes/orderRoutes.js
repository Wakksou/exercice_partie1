// backend/routes/orderRoutes.js
const express = require('express');
const {
  createOrder,
  deleteOrder,
  getOrders,
  validateOrder,
  updateOrderStatus
} = require('../controllers/orderController');
const { authenticateToken, isAdmin } = require('../middlewares/authMiddleware');

const validate = require('../middlewares/validate');
const {
  createOrderSchema,
  updateOrderStatusSchema
} = require('../validation/orderValidation');

const router = express.Router();

// Liste des commandes : admin uniquement
router.get('/', authenticateToken, isAdmin, getOrders);

// Création de commande : utilisateur connecté
router.post(
  '/',
  authenticateToken,
  validate(createOrderSchema),
  createOrder
);

// Suppression de commande : admin uniquement (corrige le commentaire)
router.delete(
  '/:id',
  authenticateToken,
  isAdmin,
  deleteOrder
);

// Validation de commande : admin uniquement
router.put(
  '/:id/validate',
  authenticateToken,
  isAdmin,
  validateOrder
);

// Mise à jour du statut : admin uniquement + validation Joi
router.put(
  '/:orderId/status',
  authenticateToken,
  isAdmin,
  validate(updateOrderStatusSchema),
  updateOrderStatus
);

module.exports = router;

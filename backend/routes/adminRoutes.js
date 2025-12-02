// backend/routes/adminRoutes.js
const express = require('express');
const {
  getOrders,
  updateOrderStatus,
  validateOrder,
  getProducts,
  updateProductStock
} = require('../controllers/adminController');
const { authenticateToken, isAdmin } = require('../middlewares/authMiddleware');

const validate = require('../middlewares/validate');
const { updateOrderStatusSchema } = require('../validation/orderValidation');
const { updateStockSchema } = require('../validation/productValidation');

const router = express.Router();

// Récupérer la liste des commandes
router.get('/orders', authenticateToken, isAdmin, getOrders);

// Changer l'état d'une commande avec validation du statut
router.put(
  '/orders/:id/status',
  authenticateToken,
  isAdmin,
  validate(updateOrderStatusSchema),
  updateOrderStatus
);

// Valider une commande 
router.put(
  '/orders/:id/validate',
  authenticateToken,
  isAdmin,
  validateOrder
);

// Récupérer la liste des produits
router.get('/products', authenticateToken, isAdmin, getProducts);

// Mettre à jour le stock d'un produit avec validation du stock
router.put(
  '/products/:id/stock',
  authenticateToken,
  isAdmin,
  validate(updateStockSchema),
  updateProductStock
);

module.exports = router;

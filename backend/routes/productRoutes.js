// routes/productRoutes.js
const express = require('express');
const { getProducts, updateProductStock } = require('../controllers/productController');
const { authenticateToken, isAdmin } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validate');
const { updateStockSchema } = require('../validation/productValidation');

const router = express.Router();

// Liste des produits (pas de validation nécessaire sur GET)
router.get('/', getProducts);

// Mise à jour du stock d’un produit
router.put(
  '/:productId/stock',
  authenticateToken,           // doit être connecté
  isAdmin,                     // doit être admin
  validate(updateStockSchema), // valide req.body.stock
  updateProductStock           // contrôleur
);

module.exports = router;

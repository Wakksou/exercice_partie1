// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();

const { login, register, logout } = require('../controllers/authController');

// Middleware de validation générique
const validate = require('../middlewares/validate');

// Schémas Joi
const { registerSchema, loginSchema } = require('../validation/authValidation');

// Route d'inscription
router.post('/register', validate(registerSchema), register);

// Route de connexion
router.post('/login', validate(loginSchema), login);

// Déconnexion
router.post('/logout', logout);

module.exports = router;

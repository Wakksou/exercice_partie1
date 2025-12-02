// backend/middlewares/errorHandler.js

// Middleware pour les routes non trouvées
const notFound = (req, res, next) => {
  res.status(404).json({ message: `Route non trouvée : ${req.originalUrl}` });
};

// Middleware global de gestion des erreurs
// (doit avoir 4 paramètres pour qu'Express le reconnaisse comme tel)
const errorHandler = (err, req, res, next) => {
  console.error('❌ Erreur serveur :', err);

  const statusCode = res.statusCode && res.statusCode !== 200
    ? res.statusCode
    : 500;

  res.status(statusCode).json({
    message:
      err.message || 'Une erreur interne est survenue. Veuillez réessayer plus tard.',
  });
};

module.exports = {
  notFound,
  errorHandler,
};

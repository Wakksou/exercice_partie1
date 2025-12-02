// backend/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  // Ça va remonter très vite en dev si tu oublies le secret dans le .env
  throw new Error('JWT_SECRET non défini dans les variables d’environnement');
}

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  // 1On regarde d'abord s'il y a un token dans le header Authorization
  let token = null;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  // Sinon, on essaie de le récupérer dans le cookie HTTPOnly "token"
  if (!token && req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // Si on n'a toujours rien : non authentifié
  if (!token) {
    return res
      .status(401)
      .json({ error: true, message: 'Token d’authentification manquant' });
  }

  console.log(`Token reçu pour authentification : ${token}`);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.error('Erreur de vérification du token :', err.message);
      return res.status(403).json({ error: true, message: 'Token invalide' });
    }

    // On attache les infos du user au req pour les routes suivantes
    req.user = user;
    next();
  });
};

exports.isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Accès interdit' });
  }
  next();
};

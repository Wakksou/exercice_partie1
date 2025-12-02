// backend/controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // modèle utilisateur
const authLog = require('debug')('authRoutes:console');

// On ne recharge pas dotenv ici, c'est déjà fait dans server.js
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET non défini dans les variables d’environnement');
}

// Options communes pour le cookie JWT
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 60 * 60 * 1000,
};


// Petite fonction utilitaire pour créer le token
const createToken = (user) => {
  return jwt.sign(
    { userId: user._id, role: user.role },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  authLog(`Tentative de connexion pour username=${username}`);

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ message: 'Identifiants invalides' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Identifiants invalides' });
    }

    const token = createToken(user);
    res.cookie('token', token, cookieOptions);

    // Message flash
    req.flash('success', 'Connexion réussie');

    const [flashMessage] = req.flash('success');

    return res.json({
      message: flashMessage,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Erreur lors de la connexion', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};


exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  authLog(`Tentative d'inscription pour username=${username}, email=${email}`);

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      authLog(`Utilisateur existant pour email=${email}`);
      return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
    }

    const user = new User({ username, email, password });
    await user.save();

    authLog(`Utilisateur créé id=${user._id}`);

    const token = createToken(user);
    res.cookie('token', token, cookieOptions);

    // Message flash
    req.flash('success', 'Inscription réussie, bienvenue !');

    const [flashMessage] = req.flash('success');

    return res.status(201).json({
      message: flashMessage,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Erreur lors de l'inscription", error);
    return res.status(500).json({ message: 'Une erreur est survenue.' });
  }
};


exports.logout = (req, res) => {
  // On supprime le cookie côté navigateur
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });

  return res.json({ message: 'Déconnexion réussie' });
};

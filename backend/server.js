// server.js
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const session = require('express-session');
const flash = require('connect-flash');
require('dotenv').config();

const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middlewares/errorHandler');
const logger = require('./utils/logger'); // Winston

const app = express();

// CORS : important pour que les cookies soient envoyés depuis le front
const allowedOrigins = ['http://localhost:3000'];

if (process.env.FRONTEND_URL_LOCAL) {
  allowedOrigins.push(process.env.FRONTEND_URL_LOCAL);
}
if (process.env.FRONTEND_URL_PROD) {
  allowedOrigins.push(process.env.FRONTEND_URL_PROD);
}

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
};

app.use(cors(corsOptions));
// préflight OPTIONS
app.options('*', cors(corsOptions));




// Middleware globaux
app.use(express.json());
app.use(cookieParser());

// Session pour les messages flash
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'dev_session_secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    },
  })
);

// Messages flash
app.use(flash());

app.use((req, res, next) => {
  console.log(`Requête reçue : ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// 404 + gestion globale des erreurs
app.use(notFound);
app.use(errorHandler);

// Démarrage serveur APRÈS la connexion DB
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB(); // ⬅️ on attend que MongoDB Atlas soit connecté
    app.listen(PORT, () => logger.info(`Serveur en écoute sur le port ${PORT}`));
  } catch (err) {
    logger.error('❌ Erreur de connexion à la base de données :', err);
    process.exit(1); // on stop le process si la DB est down
  }
};

startServer();

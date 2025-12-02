// backend/config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI; 

  if (!mongoUri) {
    console.error('❌ MONGODB_URI non défini dans les variables d’environnement');
    throw new Error('MONGODB_URI manquante dans le .env');
  }

  try {
    console.log('🔌 Tentative de connexion à MongoDB Atlas...');

    await mongoose.connect(mongoUri /*, { useNewUrlParser: true, useUnifiedTopology: true } */);
    console.log('✅ MongoDB connecté');
  } catch (err) {
    console.error('❌ Erreur de connexion MongoDB :', err.message);
    throw err; 
  }
};

module.exports = connectDB;

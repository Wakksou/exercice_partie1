// src/services/api.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Instance Axios configurée pour parler au backend
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // important pour envoyer le cookie JWT
});

// Récupérer la liste des produits (route publique)
export const fetchProducts = () => api.get('/products');

// Créer une commande (route protégée : nécessite le cookie JWT)
export const createOrder = (orderData) => {
  console.log(`appel fonction createOrder avec orderData ${JSON.stringify(orderData)}`);

  // Le backend lit le token dans le cookie (pas besoin de localStorage)
  return api.post('/orders', orderData);
};

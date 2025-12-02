// src/services/adminApi.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // pour envoyer le cookie HTTPOnly à chaque requête
});

// Facteur commun pour gérer les erreurs
const handleError = (error, defaultMessage) => {
  console.error(defaultMessage, error);

  if (error.response && error.response.data && error.response.data.message) {
    throw new Error(error.response.data.message);
  }

  throw new Error(defaultMessage);
};

export const getOrders = async () => {
  try {
    const response = await api.get('/orders');
    return response.data;
  } catch (error) {
    handleError(error, 'Erreur lors de la récupération des commandes.');
  }
};

export const getProducts = async () => {
  try {
    const response = await api.get('/products');
    return response.data;
  } catch (error) {
    handleError(error, 'Erreur lors de la récupération des produits.');
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await api.put(`/orders/${orderId}/status`, { status });
    return response.data;
  } catch (error) {
    handleError(
      error,
      'Erreur lors de la mise à jour du statut de la commande.'
    );
  }
};

export const validateOrder = async (orderId) => {
  try {
    const response = await api.put(`/orders/${orderId}/validate`);
    return response.data;
  } catch (error) {
    handleError(error, 'Erreur lors de la validation de la commande.');
  }
};

export const updateProductStock = async (productId, stock) => {
  try {
    const response = await api.put(`/products/${productId}/stock`, { stock });
    return response.data;
  } catch (error) {
    handleError(
      error,
      'Erreur lors de la mise à jour du stock du produit.'
    );
  }
};

import axios from 'axios';

const API_URL = '/api/livres/';

export const livreService = {
  // Récupérer tous les livres
  getAllLivres: async () => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  // Récupérer un livre par ID
  getLivre: async (id) => {
    const response = await axios.get(`${API_URL}${id}`);
    return response.data;
  },

  // Rechercher des livres
  searchLivres: async (terme) => {
    const response = await axios.get(`${API_URL}search/?terme=${terme}`);
    return response.data;
  },

  // Créer un livre
  createLivre: async (livre) => {
    const response = await axios.post(API_URL, livre);
    return response.data;
  },

  // Modifier un livre
  updateLivre: async (id, livre) => {
    const response = await axios.put(`${API_URL}${id}`, livre);
    return response.data;
  },

  // Supprimer un livre
  deleteLivre: async (id) => {
    await axios.delete(`${API_URL}${id}`);
    return true;
  }
};

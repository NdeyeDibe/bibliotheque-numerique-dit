import axios from 'axios';

const API_URL = '/api/emprunts/';

export const empruntService = {
  // Récupérer tous les emprunts
  getAllEmprunts: async () => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  // Récupérer un emprunt par ID
  getEmprunt: async (id) => {
    const response = await axios.get(`${API_URL}${id}`);
    return response.data;
  },

  // Historique des emprunts d'un utilisateur
  getEmpruntsUtilisateur: async (utilisateurId) => {
    const response = await axios.get(`${API_URL}utilisateur/${utilisateurId}`);
    return response.data;
  },

  // Historique des emprunts d'un livre
  getEmpruntsLivre: async (livreId) => {
    const response = await axios.get(`${API_URL}livre/${livreId}`);
    return response.data;
  },

  // Emprunts en retard
  getEmpruntsEnRetard: async () => {
    const response = await axios.get(`${API_URL}retards/`);
    return response.data;
  },

  // Créer un emprunt
  createEmprunt: async (emprunt) => {
    const response = await axios.post(API_URL, emprunt);
    return response.data;
  },

  // Retourner un livre
  retournerLivre: async (id, dateRetour) => {
    const response = await axios.put(`${API_URL}${id}/retour`, {
      date_retour_reelle: dateRetour
    });
    return response.data;
  }
};

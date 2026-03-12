import axios from 'axios';

const API_URL = '/api/utilisateurs/';

export const utilisateurService = {
  // Récupérer tous les utilisateurs
  getAllUtilisateurs: async () => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  // Récupérer un utilisateur par ID
  getUtilisateur: async (id) => {
    const response = await axios.get(`${API_URL}${id}`);
    return response.data;
  },

  // Consulter le profil
  getProfil: async (id) => {
    const response = await axios.get(`${API_URL}${id}/profil`);
    return response.data;
  },

  // Créer un utilisateur
  createUtilisateur: async (utilisateur) => {
    const response = await axios.post(API_URL, utilisateur);
    return response.data;
  },

  // Modifier un utilisateur
  updateUtilisateur: async (id, utilisateur) => {
    const response = await axios.put(`${API_URL}${id}`, utilisateur);
    return response.data;
  },

  // Supprimer un utilisateur
  deleteUtilisateur: async (id) => {
    await axios.delete(`${API_URL}${id}`);
    return true;
  }
};

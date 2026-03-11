import React, { useState, useEffect } from 'react';
import { utilisateurService } from '../services/utilisateurService';

function UtilisateursPage() {
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingUtilisateur, setEditingUtilisateur] = useState(null);
  const [formData, setFormData] = useState({
    nom: '', prenom: '', email: '', matricule: '', type: 'etudiant'
  });

  useEffect(() => { loadUtilisateurs(); }, []);

  const loadUtilisateurs = async () => {
    setLoading(true);
    try {
      const data = await utilisateurService.getAllUtilisateurs();
      setUtilisateurs(data);
    } catch (error) {
      console.error('Erreur chargement utilisateurs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUtilisateur) {
        await utilisateurService.updateUtilisateur(editingUtilisateur.id, formData);
      } else {
        await utilisateurService.createUtilisateur(formData);
      }
      await loadUtilisateurs();
      setShowForm(false);
      setEditingUtilisateur(null);
      setFormData({ nom: '', prenom: '', email: '', matricule: '', type: 'etudiant' });
    } catch (error) {
      console.error('Erreur sauvegarde utilisateur:', error);
    }
  };

  const handleEdit = (utilisateur) => {
    setEditingUtilisateur(utilisateur);
    setFormData(utilisateur);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Supprimer cet utilisateur ?')) {
      await utilisateurService.deleteUtilisateur(id);
      await loadUtilisateurs();
    }
  };

  const getTypeBadge = (type) => {
    const badges = {
      etudiant: '🎓 Étudiant',
      professeur: '👨‍🏫 Professeur',
      personnel: '👔 Personnel'
    };
    return badges[type] || type;
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>👥 Gestion des Utilisateurs</h2>
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          + Nouvel Utilisateur
        </button>
      </div>

      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <h3>{editingUtilisateur ? 'Modifier utilisateur' : 'Nouvel utilisateur'}</h3>
            <form onSubmit={handleSubmit}>
              <input placeholder="Nom" value={formData.nom}
                onChange={(e) => setFormData({...formData, nom: e.target.value})} required />
              <input placeholder="Prénom" value={formData.prenom}
                onChange={(e) => setFormData({...formData, prenom: e.target.value})} required />
              <input placeholder="Email" type="email" value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})} required />
              <input placeholder="Matricule" value={formData.matricule}
                onChange={(e) => setFormData({...formData, matricule: e.target.value})} required />
              <select value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}>
                <option value="etudiant">Étudiant</option>
                <option value="professeur">Professeur</option>
                <option value="personnel">Personnel</option>
              </select>
              <div className="form-actions">
                <button type="submit" className="btn-primary">Sauvegarder</button>
                <button type="button" className="btn-secondary"
                  onClick={() => { setShowForm(false); setEditingUtilisateur(null); }}>
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? <p>Chargement...</p> : (
        <table className="table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Email</th>
              <th>Matricule</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {utilisateurs.map(utilisateur => (
              <tr key={utilisateur.id}>
                <td>{utilisateur.nom}</td>
                <td>{utilisateur.prenom}</td>
                <td>{utilisateur.email}</td>
                <td>{utilisateur.matricule}</td>
                <td>{getTypeBadge(utilisateur.type)}</td>
                <td>
                  <button className="btn-edit" onClick={() => handleEdit(utilisateur)}>✏️</button>
                  <button className="btn-delete" onClick={() => handleDelete(utilisateur.id)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default UtilisateursPage;

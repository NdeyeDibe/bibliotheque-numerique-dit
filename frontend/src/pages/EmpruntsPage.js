import React, { useState, useEffect } from 'react';
import { empruntService } from '../services/empruntService';

function EmpruntsPage() {
  const [emprunts, setEmprunts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    livre_id: '', utilisateur_id: '', date_retour_prevue: ''
  });

  useEffect(() => { loadEmprunts(); }, []);

  const loadEmprunts = async () => {
    setLoading(true);
    try {
      const data = await empruntService.getAllEmprunts();
      setEmprunts(data);
    } catch (error) {
      console.error('Erreur chargement emprunts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await empruntService.createEmprunt({
        ...formData,
        livre_id: parseInt(formData.livre_id),
        utilisateur_id: parseInt(formData.utilisateur_id),
        date_retour_prevue: new Date(formData.date_retour_prevue).toISOString()
      });
      await loadEmprunts();
      setShowForm(false);
      setFormData({ livre_id: '', utilisateur_id: '', date_retour_prevue: '' });
    } catch (error) {
      console.error('Erreur création emprunt:', error);
    }
  };

  const handleRetour = async (id) => {
    if (window.confirm('Confirmer le retour de ce livre ?')) {
      try {
        await empruntService.retournerLivre(id, new Date().toISOString());
        await loadEmprunts();
      } catch (error) {
        console.error('Erreur retour livre:', error);
      }
    }
  };

  const getStatutBadge = (statut) => {
    const badges = {
      en_cours: '🔵 En cours',
      retourne: '✅ Retourné',
      en_retard: '🔴 En retard'
    };
    return badges[statut] || statut;
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('fr-FR');
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>🔄 Gestion des Emprunts</h2>
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          + Nouvel Emprunt
        </button>
      </div>

      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <h3>Nouvel emprunt</h3>
            <form onSubmit={handleSubmit}>
              <input placeholder="ID du livre" type="number" value={formData.livre_id}
                onChange={(e) => setFormData({...formData, livre_id: e.target.value})} required />
              <input placeholder="ID de l'utilisateur" type="number" value={formData.utilisateur_id}
                onChange={(e) => setFormData({...formData, utilisateur_id: e.target.value})} required />
              <label>Date de retour prévue</label>
              <input type="date" value={formData.date_retour_prevue}
                onChange={(e) => setFormData({...formData, date_retour_prevue: e.target.value})} required />
              <div className="form-actions">
                <button type="submit" className="btn-primary">Sauvegarder</button>
                <button type="button" className="btn-secondary"
                  onClick={() => setShowForm(false)}>
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
              <th>ID Livre</th>
              <th>ID Utilisateur</th>
              <th>Date Emprunt</th>
              <th>Date Retour Prévue</th>
              <th>Date Retour Réelle</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {emprunts.map(emprunt => (
              <tr key={emprunt.id}>
                <td>{emprunt.livre_id}</td>
                <td>{emprunt.utilisateur_id}</td>
                <td>{formatDate(emprunt.date_emprunt)}</td>
                <td>{formatDate(emprunt.date_retour_prevue)}</td>
                <td>{formatDate(emprunt.date_retour_reelle)}</td>
                <td>{getStatutBadge(emprunt.statut)}</td>
                <td>
                  {emprunt.statut === 'en_cours' && (
                    <button className="btn-primary"
                      onClick={() => handleRetour(emprunt.id)}>
                      Retourner
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default EmpruntsPage;

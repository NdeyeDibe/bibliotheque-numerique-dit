import React, { useState, useEffect } from 'react';
import { empruntService } from '../services/empruntService';

function EmpruntsPage() {
  const [emprunts, setEmprunts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ livre_id: '', utilisateur_id: '', date_retour_prevue: '' });

  useEffect(() => { loadEmprunts(); }, []);

  const loadEmprunts = async () => {
    setLoading(true);
    try {
      const data = await empruntService.getAllEmprunts();
      setEmprunts(data);
    } catch (error) {
      console.error('Erreur chargement emprunts:', error);
    } finally { setLoading(false); }
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
    } catch (error) { console.error('Erreur création emprunt:', error); }
  };

  const handleRetour = async (id) => {
    if (window.confirm('Confirmer le retour de ce livre ?')) {
      try {
        await empruntService.retournerLivre(id, new Date().toISOString());
        await loadEmprunts();
      } catch (error) { console.error('Erreur retour livre:', error); }
    }
  };

  const getStatutBadge = (statut) => {
    const config = {
      en_cours: { label: 'En cours', color: '#e0faf5', text: '#00875a', dot: '#00c9a7' },
      retourne: { label: 'Retourné', color: '#f0fdf4', text: '#16a34a', dot: '#22c55e' },
      en_retard: { label: 'En retard', color: '#fff0f0', text: '#dc2626', dot: '#ef4444' }
    };
    const c = config[statut] || { label: statut, color: '#f1f5f9', text: '#475569', dot: '#94a3b8' };
    return (
      <span style={{ background: c.color, color: c.text, padding: '5px 12px', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: c.dot, display: 'inline-block' }}></span>
        {c.label}
      </span>
    );
  };

  const formatDate = (date) => {
    if (!date) return <span style={{color:'#94a3b8'}}>—</span>;
    return new Date(date).toLocaleDateString('fr-FR');
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>🔄 Gestion des Emprunts</h2>
        <button className="btn-primary" onClick={() => setShowForm(true)}>+ Nouvel Emprunt</button>
      </div>

      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <div className="modal-header-icon">🔄</div>
              <h3>Nouvel emprunt</h3>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">ID du Livre</label>
                <input placeholder="Ex: 1" type="number" value={formData.livre_id} onChange={(e) => setFormData({...formData, livre_id: e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label">ID de l'Utilisateur</label>
                <input placeholder="Ex: 1" type="number" value={formData.utilisateur_id} onChange={(e) => setFormData({...formData, utilisateur_id: e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label">Date de retour prévue</label>
                <input type="date" value={formData.date_retour_prevue} onChange={(e) => setFormData({...formData, date_retour_prevue: e.target.value})} required />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-primary">Sauvegarder</button>
                <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? <p className="loading">Chargement...</p> : (
        <div className="table-wrapper">
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
                  <td><code style={{background:'#f1f5f9', padding:'2px 8px', borderRadius:'4px', fontSize:'0.85rem'}}>#{emprunt.livre_id}</code></td>
                  <td><code style={{background:'#f1f5f9', padding:'2px 8px', borderRadius:'4px', fontSize:'0.85rem'}}>#{emprunt.utilisateur_id}</code></td>
                  <td>{formatDate(emprunt.date_emprunt)}</td>
                  <td>{formatDate(emprunt.date_retour_prevue)}</td>
                  <td>{formatDate(emprunt.date_retour_reelle)}</td>
                  <td>{getStatutBadge(emprunt.statut)}</td>
                  <td>
                    {emprunt.statut === 'en_cours' && (
                      <button className="btn-return" onClick={() => handleRetour(emprunt.id)}>
                        ↩ Retourner
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default EmpruntsPage;

import React, { useState, useEffect } from 'react';
import { utilisateurService } from '../services/utilisateurService';

function UtilisateursPage() {
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingUtilisateur, setEditingUtilisateur] = useState(null);
  const [formData, setFormData] = useState({ nom: '', prenom: '', email: '', matricule: '', type: 'etudiant' });

  useEffect(() => { loadUtilisateurs(); }, []);

  const loadUtilisateurs = async () => {
    setLoading(true);
    try {
      const data = await utilisateurService.getAllUtilisateurs();
      setUtilisateurs(data);
    } catch (error) {
      console.error('Erreur chargement utilisateurs:', error);
    } finally { setLoading(false); }
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
    } catch (error) { console.error('Erreur sauvegarde utilisateur:', error); }
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
    const config = {
      etudiant: { label: 'Étudiant', icon: '🎓', color: '#e0f2fe', text: '#0369a1' },
      professeur: { label: 'Professeur', icon: '👨‍🏫', color: '#f0fdf4', text: '#15803d' },
      personnel: { label: 'Personnel', icon: '👔', color: '#fef9c3', text: '#854d0e' }
    };
    const c = config[type] || { label: type, icon: '👤', color: '#f1f5f9', text: '#475569' };
    return (
      <span style={{ background: c.color, color: c.text, padding: '4px 12px', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 600 }}>
        {c.icon} {c.label}
      </span>
    );
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>👥 Gestion des Utilisateurs</h2>
        <button className="btn-primary" onClick={() => setShowForm(true)}>+ Nouvel Utilisateur</button>
      </div>

      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <div className="modal-header-icon">👤</div>
              <h3>{editingUtilisateur ? 'Modifier utilisateur' : 'Nouvel utilisateur'}</h3>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Nom</label>
                <input placeholder="Nom de famille" value={formData.nom} onChange={(e) => setFormData({...formData, nom: e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label">Prénom</label>
                <input placeholder="Prénom" value={formData.prenom} onChange={(e) => setFormData({...formData, prenom: e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input placeholder="adresse@email.com" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label">Matricule</label>
                <input placeholder="DIT-2025-001" value={formData.matricule} onChange={(e) => setFormData({...formData, matricule: e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label">Type</label>
                <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}>
                  <option value="etudiant">🎓 Étudiant</option>
                  <option value="professeur">👨‍🏫 Professeur</option>
                  <option value="personnel">👔 Personnel</option>
                </select>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-primary">Sauvegarder</button>
                <button type="button" className="btn-secondary" onClick={() => { setShowForm(false); setEditingUtilisateur(null); }}>Annuler</button>
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
                  <td><strong>{utilisateur.nom}</strong></td>
                  <td>{utilisateur.prenom}</td>
                  <td style={{color: '#2563a8'}}>{utilisateur.email}</td>
                  <td><code style={{background:'#f1f5f9', padding:'2px 8px', borderRadius:'4px', fontSize:'0.85rem'}}>{utilisateur.matricule}</code></td>
                  <td>{getTypeBadge(utilisateur.type)}</td>
                  <td>
                    <button className="btn-edit" onClick={() => handleEdit(utilisateur)}>✏️ Modifier</button>
                    <button className="btn-delete" onClick={() => handleDelete(utilisateur.id)}>🗑️ Supprimer</button>
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

export default UtilisateursPage;

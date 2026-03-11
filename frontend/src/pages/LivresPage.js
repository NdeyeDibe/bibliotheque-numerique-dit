import React, { useState, useEffect } from 'react';
import { livreService } from '../services/livreService';

function LivresPage() {
  const [livres, setLivres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingLivre, setEditingLivre] = useState(null);
  const [formData, setFormData] = useState({
    titre: '', auteur: '', isbn: '', quantite: 1, disponible: true
  });

  useEffect(() => { loadLivres(); }, []);

  const loadLivres = async () => {
    setLoading(true);
    try {
      const data = await livreService.getAllLivres();
      setLivres(data);
    } catch (error) {
      console.error('Erreur chargement livres:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value.length > 2) {
      const data = await livreService.searchLivres(e.target.value);
      setLivres(data);
    } else if (e.target.value === '') {
      loadLivres();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingLivre) {
        await livreService.updateLivre(editingLivre.id, formData);
      } else {
        await livreService.createLivre(formData);
      }
      await loadLivres();
      setShowForm(false);
      setEditingLivre(null);
      setFormData({ titre: '', auteur: '', isbn: '', quantite: 1, disponible: true });
    } catch (error) {
      console.error('Erreur sauvegarde livre:', error);
    }
  };

  const handleEdit = (livre) => {
    setEditingLivre(livre);
    setFormData(livre);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Supprimer ce livre ?')) {
      await livreService.deleteLivre(id);
      await loadLivres();
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>📚 Gestion des Livres</h2>
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          + Nouveau Livre
        </button>
      </div>

      <input
        type="text"
        placeholder="Rechercher par titre, auteur ou ISBN..."
        value={searchTerm}
        onChange={handleSearch}
        className="search-input"
      />

      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <h3>{editingLivre ? 'Modifier le livre' : 'Nouveau livre'}</h3>
            <form onSubmit={handleSubmit}>
              <input placeholder="Titre" value={formData.titre}
                onChange={(e) => setFormData({...formData, titre: e.target.value})} required />
              <input placeholder="Auteur" value={formData.auteur}
                onChange={(e) => setFormData({...formData, auteur: e.target.value})} required />
              <input placeholder="ISBN" value={formData.isbn}
                onChange={(e) => setFormData({...formData, isbn: e.target.value})} required />
              <input type="number" placeholder="Quantité" value={formData.quantite}
                onChange={(e) => setFormData({...formData, quantite: parseInt(e.target.value)})} required />
              <div className="form-actions">
                <button type="submit" className="btn-primary">Sauvegarder</button>
                <button type="button" className="btn-secondary"
                  onClick={() => { setShowForm(false); setEditingLivre(null); }}>
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
              <th>Titre</th>
              <th>Auteur</th>
              <th>ISBN</th>
              <th>Quantité</th>
              <th>Disponible</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {livres.map(livre => (
              <tr key={livre.id}>
                <td>{livre.titre}</td>
                <td>{livre.auteur}</td>
                <td>{livre.isbn}</td>
                <td>{livre.quantite}</td>
                <td>{livre.disponible ? '✅' : '❌'}</td>
                <td>
                  <button className="btn-edit" onClick={() => handleEdit(livre)}>✏️</button>
                  <button className="btn-delete" onClick={() => handleDelete(livre.id)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default LivresPage;

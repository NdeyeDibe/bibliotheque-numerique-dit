import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Search, Pencil, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { livreService } from '../services/livreService';

function LivresPage() {
  const [livres, setLivres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingLivre, setEditingLivre] = useState(null);
  const [formData, setFormData] = useState({ titre: '', auteur: '', isbn: '', quantite: 1, disponible: true });

  useEffect(() => { loadLivres(); }, []);

  const loadLivres = async () => {
    setLoading(true);
    try {
      const data = await livreService.getAllLivres();
      setLivres(data);
    } catch (error) {
      console.error('Erreur chargement livres:', error);
    } finally { setLoading(false); }
  };

  const handleSearch = async (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value.length > 2) {
      const data = await livreService.searchLivres(e.target.value);
      setLivres(data);
    } else if (e.target.value === '') { loadLivres(); }
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
    } catch (error) { console.error('Erreur sauvegarde livre:', error); }
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
        <h2><BookOpen size={28} strokeWidth={2} /> Gestion des Livres</h2>
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          <Plus size={16} style={{marginRight:'6px', verticalAlign:'middle'}} />
          Nouveau Livre
        </button>
      </div>

      <div className="search-bar">
        <Search size={18} className="search-icon" />
        <input type="text" placeholder="Rechercher par titre, auteur ou ISBN..."
          value={searchTerm} onChange={handleSearch} className="search-input" />
      </div>

      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <div className="modal-header-icon"><BookOpen size={20} color="#00c9a7" /></div>
              <h3>{editingLivre ? 'Modifier le livre' : 'Nouveau livre'}</h3>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Titre</label>
                <input placeholder="Titre du livre" value={formData.titre}
                  onChange={(e) => setFormData({...formData, titre: e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label">Auteur</label>
                <input placeholder="Nom de l'auteur" value={formData.auteur}
                  onChange={(e) => setFormData({...formData, auteur: e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label">ISBN</label>
                <input placeholder="978-XXXXXXXXXX" value={formData.isbn}
                  onChange={(e) => setFormData({...formData, isbn: e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label">Quantité</label>
                <input type="number" placeholder="1" value={formData.quantite}
                  onChange={(e) => setFormData({...formData, quantite: parseInt(e.target.value)})} required />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-primary">Sauvegarder</button>
                <button type="button" className="btn-secondary"
                  onClick={() => { setShowForm(false); setEditingLivre(null); }}>Annuler</button>
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
                  <td><code style={{background:'#f1f5f9', padding:'2px 8px', borderRadius:'4px', fontSize:'0.85rem'}}>{livre.isbn}</code></td>
                  <td><strong>{livre.quantite}</strong></td>
                  <td>
                    {livre.disponible
                      ? <span style={{display:'inline-flex', alignItems:'center', gap:'4px', color:'#16a34a', fontWeight:600}}><CheckCircle size={16} /> Oui</span>
                      : <span style={{display:'inline-flex', alignItems:'center', gap:'4px', color:'#dc2626', fontWeight:600}}><XCircle size={16} /> Non</span>
                    }
                  </td>
                  <td>
                    <button className="btn-edit" onClick={() => handleEdit(livre)}>
                      <Pencil size={14} style={{marginRight:'4px', verticalAlign:'middle'}} />Modifier
                    </button>
                    <button className="btn-delete" onClick={() => handleDelete(livre.id)}>
                      <Trash2 size={14} style={{marginRight:'4px', verticalAlign:'middle'}} />Supprimer
                    </button>
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

export default LivresPage;

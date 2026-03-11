import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import LivresPage from './pages/LivresPage';
import UtilisateursPage from './pages/UtilisateursPage';
import EmpruntsPage from './pages/EmpruntsPage';
import './styles/App.css';

function App() {
  return (
    <Router>
      <div className="app">
        {/* Navbar */}
        <nav className="navbar">
          <div className="navbar-brand">
            📖 Bibliothèque DIT
          </div>
          <div className="navbar-links">
            <NavLink to="/livres" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              📚 Livres
            </NavLink>
            <NavLink to="/utilisateurs" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              👥 Utilisateurs
            </NavLink>
            <NavLink to="/emprunts" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              🔄 Emprunts
            </NavLink>
          </div>
        </nav>

        {/* Contenu principal */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<LivresPage />} />
            <Route path="/livres" element={<LivresPage />} />
            <Route path="/utilisateurs" element={<UtilisateursPage />} />
            <Route path="/emprunts" element={<EmpruntsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

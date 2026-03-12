import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { BookOpen, Users, RefreshCw } from 'lucide-react';
import LivresPage from './pages/LivresPage';
import UtilisateursPage from './pages/UtilisateursPage';
import EmpruntsPage from './pages/EmpruntsPage';
import './styles/App.css';

function HeroBanner() {
  return (
    <div className="hero-banner">
      <div className="hero-bg"></div>
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <div className="hero-left">
          <div className="hero-badge">✦ Plateforme Académique DIT</div>
          <h1 className="hero-title">
            Bibliothèque<br/><span>Numérique</span> DIT
          </h1>
          <p className="hero-subtitle">
            Gérez vos collections, utilisateurs et emprunts en toute simplicité.<br/>
            Une plateforme moderne pour l'école de l'Intelligence Artificielle.
          </p>
        </div>
        <div className="hero-right">
          <div className="hero-stat-card">
            <div className="hero-stat-number">∞</div>
            <div className="hero-stat-label">Livres</div>
          </div>
          <div className="hero-stat-card">
            <div className="hero-stat-number">24/7</div>
            <div className="hero-stat-label">Accès</div>
          </div>
          <div className="hero-stat-card">
            <div className="hero-stat-number">100%</div>
            <div className="hero-stat-label">Numérique</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AppLayout() {
  const location = useLocation();
  return (
    <div className="app">
      <nav className="navbar">
        <div className="navbar-brand">
          <img src="/logo-dit.png" alt="DIT" className="navbar-logo" />
          <div className="navbar-separator"></div>
          <span className="navbar-title">Bibliothèque Numérique</span>
        </div>
        <div className="navbar-links">
          <NavLink to="/livres" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <BookOpen size={17} /> Livres
          </NavLink>
          <NavLink to="/utilisateurs" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <Users size={17} /> Utilisateurs
          </NavLink>
          <NavLink to="/emprunts" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <RefreshCw size={17} /> Emprunts
          </NavLink>
        </div>
      </nav>
      <HeroBanner />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<LivresPage />} />
          <Route path="/livres" element={<LivresPage />} />
          <Route path="/utilisateurs" element={<UtilisateursPage />} />
          <Route path="/emprunts" element={<EmpruntsPage />} />
        </Routes>
      </main>
      <footer style={{background:'#1a3a6b',color:'rgba(255,255,255,0.4)',textAlign:'center',padding:'20px',fontSize:'0.9rem',marginTop:'60px'}}>
        © 2026 Dakar Institute of Technology · L'école de l'Intelligence Artificielle
      </footer>
    </div>
  );
}

function App() {
  return <Router><AppLayout /></Router>;
}

export default App;

// src/components/Navigation.jsx
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './Navigation.css';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const menuItems = [
    { path: '/', label: 'Inicio', icon: '🏠' },
    { path: '/planeador', label: 'Planeador', icon: '📅' },
    { path: '/diario', label: 'Diario', icon: '📔' },
    { path: '/tips', label: 'Tips', icon: '💡' },
    { path: '/perfil', label: 'Perfil', icon: '👤' }
  ];

  return (
    <>
      {/* Botón móvil */}
      <button 
        className="nav-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle navigation"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Navegación lateral */}
      <nav className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <h2>🧠 TDAH Tools</h2>
          <button 
            className="close-btn"
            onClick={() => setIsOpen(false)}
            aria-label="Close navigation"
          >
            ×
          </button>
        </div>

        <div className="user-info">
          <div className="user-avatar">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="Avatar" />
            ) : (
              <span>{user?.email?.[0]?.toUpperCase() || 'U'}</span>
            )}
          </div>
          <div className="user-details">
            <p className="user-name">{user?.displayName || 'Usuario'}</p>
            <p className="user-email">{user?.email}</p>
          </div>
        </div>

        <ul className="nav-menu">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink 
                to={item.path}
                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                onClick={() => setIsOpen(false)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="sidebar-footer">
          <button 
            onClick={handleLogout}
            className="logout-btn"
          >
            🚪 Cerrar Sesión
          </button>
        </div>
      </nav>

      {/* Overlay para móvil */}
      {isOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Navigation;

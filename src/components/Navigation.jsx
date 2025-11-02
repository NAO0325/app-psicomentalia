// src/components/Navigation.jsx
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

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

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    if (window.innerWidth <= 768) {
      setIsOpen(false);
    }
  };

  const navItems = [
    { path: '/', icon: '🏠', label: 'Dashboard' },
    { path: '/planeador', icon: '📅', label: 'Planeador del Día' },
    { path: '/diario', icon: '📔', label: 'Diario de Reflexión' },
    { path: '/tips', icon: '💡', label: 'Tips de Bienestar' },
    { path: '/perfil', icon: '👤', label: 'Mi Perfil' },
  ];

  return (
    <>
      {/* Toggle button para móvil */}
      <button className="nav-toggle" onClick={toggleSidebar} aria-label="Abrir menú">
        <span className="icon">☰</span>
      </button>

      {/* Overlay para cerrar el sidebar en móvil */}
      <div 
        className={`sidebar-overlay ${isOpen ? 'active' : ''}`}
        onClick={closeSidebar}
      />

      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        {/* Header del sidebar */}
        <div className="sidebar-header">
          <h2>🧠 Herramientas TDAH</h2>
          <p>Tu apoyo diario</p>
        </div>

        {/* Información del usuario */}
        {user && (
          <div className="user-info">
            <div className="user-avatar">
              {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
            </div>
            <div className="user-details">
              <h4>{user.displayName || 'Usuario'}</h4>
              <span>{user.email}</span>
            </div>
          </div>
        )}

        {/* Menú de navegación */}
        <nav>
          <ul className="nav-menu">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  onClick={closeSidebar}
                >
                  <span className="icon">{item.icon}</span>
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Botón de cerrar sesión */}
        <button onClick={handleLogout} className="btn btn-danger logout-btn">
          <span>🚪</span>
          <span>Cerrar Sesión</span>
        </button>
      </aside>
    </>
  );
};

export default Navigation;

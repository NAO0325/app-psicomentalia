// Vista presentacional de Navigation: solo UI y navegación declarativa
import React from 'react';
import { NavLink } from 'react-router-dom';

export default function View({ isOpen, toggleSidebar, closeSidebar, user, navItems, onLogout }) {
  return (
    <>
      <button className="nav-toggle" onClick={toggleSidebar} aria-label="Abrir menú">
        <span className="icon">☰</span>
      </button>

      <div className={`sidebar-overlay ${isOpen ? 'active' : ''}`} onClick={closeSidebar} />

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>🧠 Herramientas TDAH</h2>
          <p>Tu apoyo diario</p>
        </div>

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

        <nav>
          <ul className="nav-menu">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink to={item.path} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeSidebar}>
                  <span className="icon">{item.icon}</span>
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <button onClick={onLogout} className="btn btn-danger logout-btn">
          <span>🚪</span>
          <span>Cerrar Sesión</span>
        </button>
      </aside>
    </>
  );
}

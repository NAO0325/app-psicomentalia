// src/components/Dashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Dashboard = () => {
  const { user } = useAuth();
  
  const obtenerSaludo = () => {
    const hora = new Date().getHours();
    if (hora < 12) return 'Buenos días';
    if (hora < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  const widgets = [
    {
      id: 'planeador',
      titulo: '📅 Planeador del Día',
      descripcion: 'Organiza tus tareas diarias con prioridades',
      link: '/planeador',
      color: 'widget-blue'
    },
    {
      id: 'diario',
      titulo: '📔 Diario de Reflexión',
      descripcion: 'Registra tus pensamientos y emociones',
      link: '/diario',
      color: 'widget-purple'
    },
    {
      id: 'tips',
      titulo: '💡 Tips de Bienestar',
      descripcion: 'Consejos y estrategias para el TDAH',
      link: '/tips',
      color: 'widget-green'
    },
    {
      id: 'perfil',
      titulo: '⚙️ Mi Perfil',
      descripcion: 'Configura tu cuenta y preferencias',
      link: '/perfil',
      color: 'widget-orange'
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>{obtenerSaludo()}, {user?.displayName || user?.email?.split('@')[0] || 'Usuario'} 👋</h1>
        <p className="dashboard-subtitle">
          {new Date().toLocaleDateString('es-ES', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      <div className="widgets-grid">
        {widgets.map(widget => (
          <Link 
            key={widget.id} 
            to={widget.link} 
            className={`widget-card ${widget.color}`}
          >
            <h3>{widget.titulo}</h3>
            <p>{widget.descripcion}</p>
            <span className="widget-arrow">→</span>
          </Link>
        ))}
      </div>

      <div className="dashboard-stats">
        <h2>📊 Resumen Rápido</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-icon">✅</span>
            <div className="stat-content">
              <span className="stat-value">0</span>
              <span className="stat-label">Tareas Completadas Hoy</span>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">📝</span>
            <div className="stat-content">
              <span className="stat-value">0</span>
              <span className="stat-label">Días con Reflexión</span>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">🔥</span>
            <div className="stat-content">
              <span className="stat-value">0</span>
              <span className="stat-label">Racha Actual</span>
            </div>
          </div>
        </div>
      </div>

      <div className="motivational-quote">
        <p>"El TDAH no es un déficit de atención, es una abundancia de curiosidad."</p>
        <span>- Anónimo</span>
      </div>
    </div>
  );
};

export default Dashboard;

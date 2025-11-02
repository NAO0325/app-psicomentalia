// src/components/Dashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Dashboard = () => {
  const { user } = useAuth();

  // Obtener saludo según la hora
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 20) return 'Buenas tardes';
    return 'Buenas noches';
  };

  // Obtener fecha formateada
  const getFormattedDate = () => {
    const days = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 
                    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    
    const now = new Date();
    const dayName = days[now.getDay()];
    const day = now.getDate();
    const month = months[now.getMonth()];
    const year = now.getFullYear();
    
    return `${dayName}, ${day} de ${month} de ${year}`;
  };

  // Secciones principales de la app
  const sections = [
    {
      id: 'planeador',
      title: 'Planeador del Día',
      description: 'Organiza tus tareas diarias con prioridades',
      icon: '📅',
      path: '/planeador',
      color: 'blue',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      id: 'diario',
      title: 'Diario de Reflexión',
      description: 'Registra tus pensamientos y emociones',
      icon: '📔',
      path: '/diario',
      color: 'green',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      id: 'tips',
      title: 'Tips de Bienestar',
      description: 'Consejos y estrategias para el TDAH',
      icon: '💡',
      path: '/tips',
      color: 'orange',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    {
      id: 'perfil',
      title: 'Mi Perfil',
      description: 'Configura tu cuenta y preferencias',
      icon: '⚙️',
      path: '/perfil',
      color: 'purple',
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
    }
  ];

  // Stats de resumen
  const stats = [
    {
      icon: '✅',
      value: '0',
      label: 'Tareas Completadas Hoy',
      color: '#4CAF50'
    },
    {
      icon: '📝',
      value: '0',
      label: 'Días con Reflexión',
      color: '#2196F3'
    },
    {
      icon: '🔥',
      value: '0',
      label: 'Racha Actual',
      color: '#FF5722'
    }
  ];

  return (
    <div className="dashboard-container">
      {/* Header con saludo */}
      <div className="dashboard-welcome">
        <h1>
          {getGreeting()}, {user?.displayName || 'Usuario'} 👋
        </h1>
        <p className="dashboard-date">{getFormattedDate()}</p>
      </div>

      {/* Secciones principales - Cards grandes */}
      <div className="dashboard-sections">
        {sections.map((section) => (
          <Link 
            key={section.id} 
            to={section.path} 
            className="dashboard-section-card"
            style={{ background: section.gradient }}
          >
            <div className="section-card-icon">{section.icon}</div>
            <div className="section-card-content">
              <h3>{section.title}</h3>
              <p>{section.description}</p>
            </div>
            <div className="section-card-arrow">→</div>
          </Link>
        ))}
      </div>

      {/* Resumen rápido */}
      <div className="dashboard-summary">
        <h2>📊 Resumen Rápido</h2>
        <div className="summary-stats">
          {stats.map((stat, index) => (
            <div key={index} className="summary-stat-card">
              <div className="stat-icon" style={{ backgroundColor: `${stat.color}15` }}>
                <span style={{ fontSize: '2rem' }}>{stat.icon}</span>
              </div>
              <div className="stat-content">
                <div className="stat-value" style={{ color: stat.color }}>
                  {stat.value}
                </div>
                <div className="stat-label">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Frase motivacional */}
      <div className="dashboard-quote">
        <div className="quote-content">
          <p className="quote-text">
            "El TDAH no es un déficit de atención, es una abundancia de curiosidad."
          </p>
          <p className="quote-author">- Anónimo</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
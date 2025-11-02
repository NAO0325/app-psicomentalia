// src/components/Perfil.jsx
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import './Perfil.css';

const Perfil = () => {
  const { user, logout } = useAuth();
  const [preferences, setPreferences] = useState({
    notifications: true,
    theme: 'light',
    reminderTime: '09:00'
  });

  const handlePreferenceChange = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
    // Aquí guardarías las preferencias en Firebase
  };

  return (
    <div className="perfil-container">
      <div className="perfil-header">
        <h2>👤 Mi Perfil</h2>
      </div>

      <div className="perfil-content">
        {/* Información del usuario */}
        <div className="perfil-card">
          <h3>Información Personal</h3>
          <div className="perfil-info">
            <div className="info-row">
              <span className="info-label">Nombre:</span>
              <span className="info-value">{user?.displayName || 'No especificado'}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Email:</span>
              <span className="info-value">{user?.email}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Miembro desde:</span>
              <span className="info-value">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('es-ES') : 'Fecha no disponible'}
              </span>
            </div>
          </div>
        </div>

        {/* Preferencias */}
        <div className="perfil-card">
          <h3>⚙️ Preferencias</h3>
          <div className="preferences-list">
            <div className="preference-item">
              <label htmlFor="notifications">
                <span>🔔 Notificaciones</span>
                <input
                  type="checkbox"
                  id="notifications"
                  checked={preferences.notifications}
                  onChange={(e) => handlePreferenceChange('notifications', e.target.checked)}
                />
              </label>
            </div>
            <div className="preference-item">
              <label htmlFor="theme">
                <span>🎨 Tema</span>
                <select
                  id="theme"
                  value={preferences.theme}
                  onChange={(e) => handlePreferenceChange('theme', e.target.value)}
                >
                  <option value="light">Claro</option>
                  <option value="dark">Oscuro</option>
                  <option value="auto">Automático</option>
                </select>
              </label>
            </div>
            <div className="preference-item">
              <label htmlFor="reminderTime">
                <span>⏰ Hora de recordatorio diario</span>
                <input
                  type="time"
                  id="reminderTime"
                  value={preferences.reminderTime}
                  onChange={(e) => handlePreferenceChange('reminderTime', e.target.value)}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="perfil-card">
          <h3>📊 Mis Estadísticas</h3>
          <div className="stats-summary">
            <div className="stat-item">
              <span className="stat-number">0</span>
              <span className="stat-label">Tareas completadas</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">0</span>
              <span className="stat-label">Días con reflexión</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">0</span>
              <span className="stat-label">Racha máxima</span>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="perfil-actions">
          <button className="btn btn-secondary">
            📥 Exportar Datos
          </button>
          <button className="btn btn-danger" onClick={logout}>
            🚪 Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default Perfil;

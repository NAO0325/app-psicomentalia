// Contenedor de Perfil: maneja estado de preferencias y cierre de sesión
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import View from './View.jsx';

export default function Perfil() {
  const { user, logout } = useAuth();
  const [preferences, setPreferences] = useState({ notifications: true, theme: 'light', reminderTime: '09:00' });

  function handlePreferenceChange(key, value) {
    setPreferences(prev => ({ ...prev, [key]: value }));
    // TODO: persistir en backend/Firebase
  }

  return (
    <View
      user={user}
      preferences={preferences}
      onPreferenceChange={handlePreferenceChange}
      onLogout={logout}
    />
  );
}

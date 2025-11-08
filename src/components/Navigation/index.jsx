// Contenedor de Navigation: maneja estado, auth y navegación
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import View from './View.jsx';

const NAV_ITEMS = [
  { path: '/', icon: '🏠', label: 'Dashboard' },
  { path: '/planeador', icon: '📅', label: 'Planeador del Día' },
  { path: '/diario', icon: '📔', label: 'Diario de Reflexión' },
  { path: '/tips', icon: '💡', label: 'Tips de Bienestar' },
  { path: '/perfil', icon: '👤', label: 'Mi Perfil' }
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleSidebar = () => setIsOpen((v) => !v);
  const closeSidebar = () => { if (window.innerWidth <= 768) setIsOpen(false); };

  async function handleLogout() {
    try {
      await logout();
      navigate('/login');
    } catch (e) { console.error('Error al cerrar sesión:', e); }
  }

  return (
    <View
      isOpen={isOpen}
      toggleSidebar={toggleSidebar}
      closeSidebar={closeSidebar}
      user={user}
      navItems={NAV_ITEMS}
      onLogout={handleLogout}
    />
  );
}

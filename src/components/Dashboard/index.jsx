// Contenedor de Dashboard: maneja lógica y pasa props a la vista
import React, { useMemo } from 'react';
import { useAuth } from '../../hooks/useAuth';
import View from './View.jsx';

const sections = [
  { id: 'planeador', title: 'Planeador del Día', description: 'Organiza tus tareas diarias con prioridades', icon: '📅', path: '/planeador', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { id: 'diario', title: 'Diario de Reflexión', description: 'Registra tus pensamientos y emociones', icon: '📔', path: '/diario', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
  { id: 'tips', title: 'Tips de Bienestar', description: 'Consejos y estrategias para el TDAH', icon: '💡', path: '/tips', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
  { id: 'perfil', title: 'Mi Perfil', description: 'Configura tu cuenta y preferencias', icon: '⚙️', path: '/perfil', gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }
];

const baseStats = [
  { icon: '✅', value: '0', label: 'Tareas Completadas Hoy', color: '#4CAF50' },
  { icon: '📝', value: '0', label: 'Días con Reflexión', color: '#2196F3' },
  { icon: '🔥', value: '0', label: 'Racha Actual', color: '#FF5722' }
];

function getGreeting(now = new Date()) {
  const hour = now.getHours();
  if (hour < 12) return 'Buenos días';
  if (hour < 20) return 'Buenas tardes';
  return 'Buenas noches';
}

function getFormattedDate(now = new Date()) {
  const days = ['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];
  const months = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  const dayName = days[now.getDay()];
  const day = now.getDate();
  const month = months[now.getMonth()];
  const year = now.getFullYear();
  return `${dayName}, ${day} de ${month} de ${year}`;
}

export default function Dashboard() {
  const { user } = useAuth();
  const greeting = useMemo(() => getGreeting(), []);
  const dateText = useMemo(() => getFormattedDate(), []);
  const displayName = user?.displayName || 'Usuario';

  // En el futuro: stats podrían venir de un hook o repositorio
  const stats = baseStats;

  return (
    <View
      greeting={`${greeting}, ${displayName} 👋`}
      dateText={dateText}
      sections={sections}
      stats={stats}
      quote={{ text: '"El TDAH no es un déficit de atención, es una abundancia de curiosidad."', author: 'Anónimo' }}
    />
  );
}

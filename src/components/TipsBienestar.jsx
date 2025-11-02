// src/components/TipsBienestar.jsx
import React, { useState } from 'react';

const TipsBienestar = () => {
  const [categoriaActiva, setCategoriaActiva] = useState('todos');

  const tips = [
    {
      id: 1,
      categoria: 'concentracion',
      titulo: 'Técnica Pomodoro',
      descripcion: 'Trabaja 25 minutos, descansa 5. Después de 4 pomodoros, toma un descanso largo de 15-30 minutos.',
      emoji: '⏱️'
    },
    {
      id: 2,
      categoria: 'organizacion',
      titulo: 'Lista de 3 Tareas',
      descripcion: 'Cada día, elige solo 3 tareas importantes. Esto evita la sobrecarga y aumenta la sensación de logro.',
      emoji: '📝'
    },
    {
      id: 3,
      categoria: 'impulsos',
      titulo: 'Regla de los 10 Segundos',
      descripcion: 'Antes de actuar impulsivamente, cuenta hasta 10. Esto te da tiempo para reconsiderar.',
      emoji: '🛑'
    },
    {
      id: 4,
      categoria: 'rutinas',
      titulo: 'Rutina Matutina',
      descripcion: 'Establece una rutina fija cada mañana. La consistencia reduce la fatiga de decisión.',
      emoji: '🌅'
    },
    {
      id: 5,
      categoria: 'ejercicio',
      titulo: 'Movimiento Regular',
      descripcion: 'Camina 5 minutos cada hora. El movimiento ayuda a resetear tu concentración.',
      emoji: '🚶'
    },
    {
      id: 6,
      categoria: 'concentracion',
      titulo: 'Ambiente Sin Distracciones',
      descripcion: 'Mantén tu espacio de trabajo limpio y organizado. Usa auriculares con ruido blanco si es necesario.',
      emoji: '🎧'
    }
  ];

  const categorias = [
    { id: 'todos', label: 'Todos', emoji: '📚' },
    { id: 'concentracion', label: 'Concentración', emoji: '🎯' },
    { id: 'organizacion', label: 'Organización', emoji: '📊' },
    { id: 'impulsos', label: 'Control de Impulsos', emoji: '🛑' },
    { id: 'rutinas', label: 'Rutinas', emoji: '📅' },
    { id: 'ejercicio', label: 'Ejercicio', emoji: '💪' }
  ];

  const tipsFiltrados = categoriaActiva === 'todos' 
    ? tips 
    : tips.filter(tip => tip.categoria === categoriaActiva);

  return (
    <div className="tips-container">
      <div className="tips-header">
        <h2>💡 Tips de Bienestar para TDAH</h2>
        <p>Estrategias prácticas para mejorar tu día a día</p>
      </div>

      <div className="categorias-filter">
        {categorias.map(cat => (
          <button
            key={cat.id}
            onClick={() => setCategoriaActiva(cat.id)}
            className={`categoria-btn ${categoriaActiva === cat.id ? 'activo' : ''}`}
          >
            <span>{cat.emoji}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      <div className="tips-grid">
        {tipsFiltrados.map(tip => (
          <div key={tip.id} className="tip-card">
            <div className="tip-emoji">{tip.emoji}</div>
            <h3>{tip.titulo}</h3>
            <p>{tip.descripcion}</p>
            <span className="tip-categoria">{tip.categoria}</span>
          </div>
        ))}
      </div>

      <div className="tips-footer">
        <div className="info-card">
          <h3>💭 Recuerda</h3>
          <p>
            Cada persona con TDAH es única. Experimenta con diferentes estrategias 
            y quédate con las que mejor funcionen para ti. El progreso, no la 
            perfección, es la meta.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TipsBienestar;

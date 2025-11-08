// Contenedor de TipsBienestar: maneja estado de filtro y pasa datos a la vista
import React, { useMemo, useState } from 'react';
import View from './View.jsx';

const CATEGORIES = [
  { id: 'todos', label: 'Todos', emoji: '📚' },
  { id: 'concentracion', label: 'Concentración', emoji: '🎯' },
  { id: 'organizacion', label: 'Organización', emoji: '📊' },
  { id: 'impulsos', label: 'Control de Impulsos', emoji: '🛑' },
  { id: 'rutinas', label: 'Rutinas', emoji: '📅' },
  { id: 'ejercicio', label: 'Ejercicio', emoji: '💪' }
];

const TIPS = [
  { id: 1, categoria: 'concentracion', titulo: 'Técnica Pomodoro', descripcion: 'Trabaja 25 minutos, descansa 5. Después de 4 pomodoros, toma un descanso largo de 15-30 minutos.', emoji: '⏱️' },
  { id: 2, categoria: 'organizacion', titulo: 'Lista de 3 Tareas', descripcion: 'Cada día, elige solo 3 tareas importantes. Esto evita la sobrecarga y aumenta la sensación de logro.', emoji: '📝' },
  { id: 3, categoria: 'impulsos', titulo: 'Regla de los 10 Segundos', descripcion: 'Antes de actuar impulsivamente, cuenta hasta 10. Esto te da tiempo para reconsiderar.', emoji: '🛑' },
  { id: 4, categoria: 'rutinas', titulo: 'Rutina Matutina', descripcion: 'Establece una rutina fija cada mañana. La consistencia reduce la fatiga de decisión.', emoji: '🌅' },
  { id: 5, categoria: 'ejercicio', titulo: 'Movimiento Regular', descripcion: 'Camina 5 minutos cada hora. El movimiento ayuda a resetear tu concentración.', emoji: '🚶' },
  { id: 6, categoria: 'concentracion', titulo: 'Ambiente Sin Distracciones', descripcion: 'Mantén tu espacio de trabajo limpio y organizado. Usa auriculares con ruido blanco si es necesario.', emoji: '🎧' }
];

export default function TipsBienestar() {
  const [categoriaActiva, setCategoriaActiva] = useState('todos');

  const tipsFiltrados = useMemo(() => (
    categoriaActiva === 'todos' ? TIPS : TIPS.filter(t => t.categoria === categoriaActiva)
  ), [categoriaActiva]);

  return (
    <View
      categorias={CATEGORIES}
      categoriaActiva={categoriaActiva}
      setCategoriaActiva={setCategoriaActiva}
      tips={tipsFiltrados}
    />
  );
}

// src/components/PlaneadorDia.jsx
import React, { useState } from 'react';
import { useFirebaseSync } from '../hooks/useFirebaseSync';
import './PlaneadorDia.css';

const PlaneadorDia = () => {
  const [nuevaTarea, setNuevaTarea] = useState('');
  const [categoria, setCategoria] = useState('personal');
  const [prioridad, setPrioridad] = useState('media');
  const [editando, setEditando] = useState(null);
  
  const { 
    data: tareas, 
    loading, 
    addDocument, 
    updateDocument, 
    deleteDocument 
  } = useFirebaseSync('tareas', []);

  // Filtrar tareas de hoy
  const tareasHoy = tareas.filter(tarea => {
    const fechaTarea = new Date(tarea.fecha || tarea.createdAt);
    const hoy = new Date();
    return fechaTarea.toDateString() === hoy.toDateString();
  });

  const handleAgregarTarea = async (e) => {
    e.preventDefault();
    
    if (!nuevaTarea.trim()) return;
    
    const tarea = {
      texto: nuevaTarea,
      categoria,
      prioridad,
      completada: false,
      fecha: new Date().toISOString()
    };
    
    await addDocument(tarea);
    
    // Limpiar formulario
    setNuevaTarea('');
    setCategoria('personal');
    setPrioridad('media');
  };

  const toggleCompletada = async (tarea) => {
    await updateDocument(tarea.id, {
      completada: !tarea.completada,
      completadaEn: !tarea.completada ? new Date().toISOString() : null
    });
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta tarea?')) {
      await deleteDocument(id);
    }
  };

  const handleEditar = (tarea) => {
    setEditando(tarea.id);
    setNuevaTarea(tarea.texto);
    setCategoria(tarea.categoria);
    setPrioridad(tarea.prioridad);
  };

  const handleActualizar = async (e) => {
    e.preventDefault();
    
    if (!nuevaTarea.trim()) return;
    
    await updateDocument(editando, {
      texto: nuevaTarea,
      categoria,
      prioridad
    });
    
    // Limpiar formulario
    setEditando(null);
    setNuevaTarea('');
    setCategoria('personal');
    setPrioridad('media');
  };

  const calcularProgreso = () => {
    if (tareasHoy.length === 0) return 0;
    const completadas = tareasHoy.filter(t => t.completada).length;
    return Math.round((completadas / tareasHoy.length) * 100);
  };

  if (loading) {
    return (
      <div className="planeador-loading">
        <div className="spinner"></div>
        <p>Cargando tareas...</p>
      </div>
    );
  }

  return (
    <div className="planeador-container">
      <div className="planeador-header">
        <h2>📅 Mi Día</h2>
        <div className="fecha-actual">
          {new Date().toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>
      </div>

      {/* Barra de progreso */}
      <div className="progreso-container">
        <div className="progreso-info">
          <span>Progreso del día</span>
          <span>{calcularProgreso()}%</span>
        </div>
        <div className="progreso-barra">
          <div 
            className="progreso-fill"
            style={{ width: `${calcularProgreso()}%` }}
          ></div>
        </div>
      </div>

      {/* Formulario para agregar/editar tarea */}
      <form 
        onSubmit={editando ? handleActualizar : handleAgregarTarea}
        className="tarea-form"
      >
        <input
          type="text"
          placeholder="¿Qué necesitas hacer hoy?"
          value={nuevaTarea}
          onChange={(e) => setNuevaTarea(e.target.value)}
          className="tarea-input"
          autoFocus
        />
        
        <div className="tarea-opciones">
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="select-categoria"
          >
            <option value="personal">🏠 Personal</option>
            <option value="trabajo">💼 Trabajo</option>
            <option value="salud">💪 Salud</option>
            <option value="estudio">📚 Estudio</option>
            <option value="social">👥 Social</option>
          </select>
          
          <select
            value={prioridad}
            onChange={(e) => setPrioridad(e.target.value)}
            className="select-prioridad"
          >
            <option value="alta">🔴 Alta</option>
            <option value="media">🟡 Media</option>
            <option value="baja">🟢 Baja</option>
          </select>
          
          <button type="submit" className="btn-agregar">
            {editando ? '✏️ Actualizar' : '➕ Agregar'}
          </button>
          
          {editando && (
            <button
              type="button"
              onClick={() => {
                setEditando(null);
                setNuevaTarea('');
                setCategoria('personal');
                setPrioridad('media');
              }}
              className="btn-cancelar"
            >
              ❌ Cancelar
            </button>
          )}
        </div>
      </form>

      {/* Lista de tareas */}
      <div className="tareas-lista">
        {tareasHoy.length === 0 ? (
          <div className="sin-tareas">
            <p>🎯 No tienes tareas para hoy</p>
            <p>¡Agrega una para comenzar!</p>
          </div>
        ) : (
          <>
            {/* Tareas pendientes */}
            <div className="tareas-seccion">
              <h3>📋 Pendientes</h3>
              {tareasHoy
                .filter(t => !t.completada)
                .sort((a, b) => {
                  const prioridadOrden = { alta: 0, media: 1, baja: 2 };
                  return prioridadOrden[a.prioridad] - prioridadOrden[b.prioridad];
                })
                .map(tarea => (
                  <div key={tarea.id} className={`tarea-item prioridad-${tarea.prioridad}`}>
                    <input
                      type="checkbox"
                      checked={tarea.completada}
                      onChange={() => toggleCompletada(tarea)}
                      className="tarea-checkbox"
                    />
                    <div className="tarea-contenido">
                      <span className="tarea-texto">{tarea.texto}</span>
                      <div className="tarea-meta">
                        <span className="tarea-categoria">{tarea.categoria}</span>
                        <span className="tarea-prioridad">{tarea.prioridad}</span>
                      </div>
                    </div>
                    <div className="tarea-acciones">
                      <button
                        onClick={() => handleEditar(tarea)}
                        className="btn-editar"
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleEliminar(tarea.id)}
                        className="btn-eliminar"
                        title="Eliminar"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
            </div>

            {/* Tareas completadas */}
            {tareasHoy.some(t => t.completada) && (
              <div className="tareas-seccion completadas">
                <h3>✅ Completadas</h3>
                {tareasHoy
                  .filter(t => t.completada)
                  .map(tarea => (
                    <div key={tarea.id} className="tarea-item tarea-completada">
                      <input
                        type="checkbox"
                        checked={tarea.completada}
                        onChange={() => toggleCompletada(tarea)}
                        className="tarea-checkbox"
                      />
                      <div className="tarea-contenido">
                        <span className="tarea-texto">{tarea.texto}</span>
                        <div className="tarea-meta">
                          <span className="tarea-categoria">{tarea.categoria}</span>
                          {tarea.completadaEn && (
                            <span className="tarea-hora">
                              Completada: {new Date(tarea.completadaEn).toLocaleTimeString('es-ES', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleEliminar(tarea.id)}
                        className="btn-eliminar"
                        title="Eliminar"
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Estadísticas rápidas */}
      {tareasHoy.length > 0 && (
        <div className="estadisticas-rapidas">
          <div className="stat-item">
            <span className="stat-valor">{tareasHoy.length}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat-item">
            <span className="stat-valor">{tareasHoy.filter(t => t.completada).length}</span>
            <span className="stat-label">Completadas</span>
          </div>
          <div className="stat-item">
            <span className="stat-valor">{tareasHoy.filter(t => !t.completada).length}</span>
            <span className="stat-label">Pendientes</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaneadorDia;

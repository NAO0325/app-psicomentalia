// Vista presentacional de PlaneadorDia: sin efectos, solo UI y props
import React from 'react';
import { Link } from 'react-router-dom';

export default function View({
  fechaActual,
  diaDelMes,
  progresoDelDia,
  loading,
  tareas,
  tareasCompletadas,
  tareasPendientes,
  nuevaTarea,
  onNuevaTareaChange,
  onAgregarTarea,
  onToggleTarea,
  onEliminarTarea,
  agregando
}) {
  return (
    <div className="planeador-container">
      <div className="planeador-header">
        <Link to="/" className="back-link">← Volver al menú</Link>
        <div className="planeador-title-section">
          <div className="date-badge">
            <span className="date-icon">📅</span>
            <span className="date-number">{diaDelMes}</span>
          </div>
          <div className="title-content">
            <h1>📅 Planeador del Día</h1>
            <p className="date-subtitle">{fechaActual}</p>
          </div>
        </div>
        <div className="progreso-dia">
          <div className="progreso-header">
            <span>Progreso del día</span>
            <span className="progreso-percent">{progresoDelDia}%</span>
          </div>
          <div className="progreso-bar">
            <div className="progreso-fill" style={{ width: `${progresoDelDia}%` }} />
          </div>
        </div>
      </div>

      <div className="agregar-tarea-section">
        <form onSubmit={onAgregarTarea} className="agregar-tarea-form">
          <input
            type="text"
            value={nuevaTarea}
            onChange={(e) => onNuevaTareaChange(e.target.value)}
            placeholder="Agrega una nueva tarea..."
            disabled={agregando}
            className="tarea-input"
          />
          <button type="submit" disabled={agregando || !nuevaTarea.trim()} className="btn-agregar" aria-label="Agregar tarea">
            <span>+</span>
          </button>
        </form>
      </div>

      <div className="tareas-content">
        {loading ? (
          <div className="loading-state">
            <div className="spinner-large"></div>
            <p>Cargando tareas...</p>
          </div>
        ) : tareas.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <p>No hay tareas todavía. ¡Agrega tu primera tarea!</p>
          </div>
        ) : (
          <>
            {tareasPendientes > 0 && (
              <div className="tareas-section">
                <div className="section-header">
                  <span className="section-icon">📋</span>
                  <h2>Pendientes</h2>
                  <span className="section-count">{tareasPendientes}</span>
                </div>
                <div className="tareas-list">
                  {tareas.filter(t => !t.completada).map(t => (
                    <div key={t.id} className="tarea-item">
                      <div className="tarea-checkbox-wrapper">
                        <input type="checkbox" checked={t.completada} onChange={() => onToggleTarea(t.id, t.completada)} className="tarea-checkbox" id={`tarea-${t.id}`} />
                        <label htmlFor={`tarea-${t.id}`} className="checkbox-label"></label>
                      </div>
                      <div className="tarea-content">
                        <span className="tarea-titulo">{t.titulo}</span>
                      </div>
                      <button onClick={() => onEliminarTarea(t.id)} className="btn-eliminar" aria-label="Eliminar tarea">🗑️</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tareasCompletadas > 0 && (
              <div className="tareas-section completadas-section">
                <div className="section-header">
                  <span className="section-icon">✅</span>
                  <h2>Completadas</h2>
                  <span className="section-count">{tareasCompletadas}</span>
                </div>
                <div className="tareas-list">
                  {tareas.filter(t => t.completada).map(t => (
                    <div key={t.id} className="tarea-item tarea-completada">
                      <div className="tarea-checkbox-wrapper">
                        <input type="checkbox" checked={t.completada} onChange={() => onToggleTarea(t.id, t.completada)} className="tarea-checkbox" id={`tarea-${t.id}`} />
                        <label htmlFor={`tarea-${t.id}`} className="checkbox-label"></label>
                      </div>
                      <div className="tarea-content">
                        <span className="tarea-titulo">{t.titulo}</span>
                      </div>
                      <button onClick={() => onEliminarTarea(t.id)} className="btn-eliminar" aria-label="Eliminar tarea">🗑️</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {tareas.length > 0 && (
        <div className="resumen-dia">
          <div className="resumen-stats">
            <div className="stat-item">
              <span className="stat-number">{tareas.length}</span>
              <span className="stat-label">Total</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{tareasCompletadas}</span>
              <span className="stat-label">Completadas</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{tareasPendientes}</span>
              <span className="stat-label">Pendientes</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

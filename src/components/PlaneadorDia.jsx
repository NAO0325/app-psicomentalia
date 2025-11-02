// src/components/PlaneadorDia.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { db } from '../config/firebase';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc,
  orderBy 
} from 'firebase/firestore';
import { Link } from 'react-router-dom';

const PlaneadorDia = () => {
  const { user } = useAuth();
  const [tareas, setTareas] = useState([]);
  const [nuevaTarea, setNuevaTarea] = useState('');
  const [loading, setLoading] = useState(true);
  const [agregando, setAgregando] = useState(false);

  // Obtener fecha actual formateada
  const getFechaActual = () => {
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date().toLocaleDateString('es-ES', options);
  };

  // Obtener día del mes
  const getDiaDelMes = () => {
    return new Date().getDate();
  };

  // Cargar tareas del día
  useEffect(() => {
    if (user) {
      cargarTareas();
    }
  }, [user]);

  const cargarTareas = async () => {
    try {
      setLoading(true);
      const fechaHoy = new Date().toISOString().split('T')[0];

      const q = query(
        collection(db, 'tareas'),
        where('userId', '==', user.uid),
        where('fecha', '==', fechaHoy),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const tareasData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setTareas(tareasData);
    } catch (error) {
      console.error('Error al cargar tareas:', error);
    } finally {
      setLoading(false);
    }
  };

  const agregarTarea = async (e) => {
    e.preventDefault();
    
    if (!nuevaTarea.trim()) return;

    try {
      setAgregando(true);
      const fechaHoy = new Date().toISOString().split('T')[0];

      const nuevaTareaDoc = {
        userId: user.uid,
        titulo: nuevaTarea,
        completada: false,
        fecha: fechaHoy,
        createdAt: new Date().toISOString()
      };

      const docRef = await addDoc(collection(db, 'tareas'), nuevaTareaDoc);
      
      setTareas([{ id: docRef.id, ...nuevaTareaDoc }, ...tareas]);
      setNuevaTarea('');
    } catch (error) {
      console.error('Error al agregar tarea:', error);
    } finally {
      setAgregando(false);
    }
  };

  const toggleTarea = async (tareaId, completada) => {
    try {
      const tareaRef = doc(db, 'tareas', tareaId);
      await updateDoc(tareaRef, {
        completada: !completada
      });

      setTareas(tareas.map(t => 
        t.id === tareaId ? { ...t, completada: !completada } : t
      ));
    } catch (error) {
      console.error('Error al actualizar tarea:', error);
    }
  };

  const eliminarTarea = async (tareaId) => {
    if (!window.confirm('¿Estás seguro de eliminar esta tarea?')) return;

    try {
      await deleteDoc(doc(db, 'tareas', tareaId));
      setTareas(tareas.filter(t => t.id !== tareaId));
    } catch (error) {
      console.error('Error al eliminar tarea:', error);
    }
  };

  // Calcular estadísticas
  const tareasCompletadas = tareas.filter(t => t.completada).length;
  const tareasPendientes = tareas.filter(t => !t.completada).length;
  const progresoDelDia = tareas.length > 0 
    ? Math.round((tareasCompletadas / tareas.length) * 100) 
    : 0;

  return (
    <div className="planeador-container">
      {/* Header con fecha */}
      <div className="planeador-header">
        <Link to="/" className="back-link">
          ← Volver al menú
        </Link>
        
        <div className="planeador-title-section">
          <div className="date-badge">
            <span className="date-icon">📅</span>
            <span className="date-number">{getDiaDelMes()}</span>
          </div>
          
          <div className="title-content">
            <h1>📅 Planeador del Día</h1>
            <p className="date-subtitle">{getFechaActual()}</p>
          </div>
        </div>

        {/* Progreso del día */}
        <div className="progreso-dia">
          <div className="progreso-header">
            <span>Progreso del día</span>
            <span className="progreso-percent">{progresoDelDia}%</span>
          </div>
          <div className="progreso-bar">
            <div 
              className="progreso-fill" 
              style={{ width: `${progresoDelDia}%` }}
            />
          </div>
        </div>
      </div>

      {/* Formulario agregar tarea */}
      <div className="agregar-tarea-section">
        <form onSubmit={agregarTarea} className="agregar-tarea-form">
          <input
            type="text"
            value={nuevaTarea}
            onChange={(e) => setNuevaTarea(e.target.value)}
            placeholder="Agrega una nueva tarea..."
            disabled={agregando}
            className="tarea-input"
          />
          <button 
            type="submit" 
            disabled={agregando || !nuevaTarea.trim()}
            className="btn-agregar"
            aria-label="Agregar tarea"
          >
            <span>+</span>
          </button>
        </form>
      </div>

      {/* Lista de tareas */}
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
            {/* Sección: Pendientes */}
            {tareasPendientes > 0 && (
              <div className="tareas-section">
                <div className="section-header">
                  <span className="section-icon">📋</span>
                  <h2>Pendientes</h2>
                  <span className="section-count">{tareasPendientes}</span>
                </div>
                
                <div className="tareas-list">
                  {tareas
                    .filter(t => !t.completada)
                    .map(tarea => (
                      <div key={tarea.id} className="tarea-item">
                        <div className="tarea-checkbox-wrapper">
                          <input
                            type="checkbox"
                            checked={tarea.completada}
                            onChange={() => toggleTarea(tarea.id, tarea.completada)}
                            className="tarea-checkbox"
                            id={`tarea-${tarea.id}`}
                          />
                          <label htmlFor={`tarea-${tarea.id}`} className="checkbox-label"></label>
                        </div>
                        
                        <div className="tarea-content">
                          <span className="tarea-titulo">{tarea.titulo}</span>
                        </div>
                        
                        <button
                          onClick={() => eliminarTarea(tarea.id)}
                          className="btn-eliminar"
                          aria-label="Eliminar tarea"
                        >
                          🗑️
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Sección: Completadas */}
            {tareasCompletadas > 0 && (
              <div className="tareas-section completadas-section">
                <div className="section-header">
                  <span className="section-icon">✅</span>
                  <h2>Completadas</h2>
                  <span className="section-count">{tareasCompletadas}</span>
                </div>
                
                <div className="tareas-list">
                  {tareas
                    .filter(t => t.completada)
                    .map(tarea => (
                      <div key={tarea.id} className="tarea-item tarea-completada">
                        <div className="tarea-checkbox-wrapper">
                          <input
                            type="checkbox"
                            checked={tarea.completada}
                            onChange={() => toggleTarea(tarea.id, tarea.completada)}
                            className="tarea-checkbox"
                            id={`tarea-${tarea.id}`}
                          />
                          <label htmlFor={`tarea-${tarea.id}`} className="checkbox-label"></label>
                        </div>
                        
                        <div className="tarea-content">
                          <span className="tarea-titulo">{tarea.titulo}</span>
                        </div>
                        
                        <button
                          onClick={() => eliminarTarea(tarea.id)}
                          className="btn-eliminar"
                          aria-label="Eliminar tarea"
                        >
                          🗑️
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Resumen del día */}
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
};

export default PlaneadorDia;

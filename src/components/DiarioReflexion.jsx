// src/components/DiarioReflexion.jsx
import React, { useState, useEffect } from 'react';
import { useFirebaseSync } from '../hooks/useFirebaseSync';
import './DiarioReflexion.css';

const DiarioReflexion = () => {
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [positivo, setPositivo] = useState('');
  const [mejorar, setMejorar] = useState('');
  const [emocion, setEmocion] = useState('neutral');
  const [energia, setEnergia] = useState(5);
  const [editando, setEditando] = useState(null);
  const [vistaHistorial, setVistaHistorial] = useState(false);
  
  const { 
    data: entradas, 
    loading, 
    addDocument, 
    updateDocument, 
    deleteDocument 
  } = useFirebaseSync('diarios', []);

  // Buscar entrada del día actual
  useEffect(() => {
    const entradaHoy = entradas.find(e => 
      new Date(e.fecha).toDateString() === new Date(fecha).toDateString()
    );
    
    if (entradaHoy && !editando) {
      setPositivo(entradaHoy.positivo);
      setMejorar(entradaHoy.mejorar);
      setEmocion(entradaHoy.emocion || 'neutral');
      setEnergia(entradaHoy.energia || 5);
      setEditando(entradaHoy.id);
    } else if (!entradaHoy && !editando) {
      limpiarFormulario();
    }
  }, [fecha, entradas]);

  const limpiarFormulario = () => {
    setPositivo('');
    setMejorar('');
    setEmocion('neutral');
    setEnergia(5);
    setEditando(null);
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    
    if (!positivo.trim() && !mejorar.trim()) {
      alert('Por favor, escribe al menos una reflexión');
      return;
    }
    
    const entrada = {
      fecha,
      positivo,
      mejorar,
      emocion,
      energia,
      estadoAnimo: calcularEstadoAnimo()
    };
    
    if (editando) {
      await updateDocument(editando, entrada);
    } else {
      await addDocument(entrada);
    }
    
    alert('✨ Reflexión guardada con éxito');
  };

  const calcularEstadoAnimo = () => {
    const emociones = {
      'muy_feliz': 5,
      'feliz': 4,
      'neutral': 3,
      'triste': 2,
      'muy_triste': 1
    };
    return (emociones[emocion] + energia) / 2;
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta reflexión?')) {
      await deleteDocument(id);
      limpiarFormulario();
    }
  };

  const obtenerEstadisticas = () => {
    if (entradas.length === 0) return null;
    
    const ultimaSemana = entradas.slice(0, 7);
    const promedioEnergia = ultimaSemana.reduce((acc, e) => acc + (e.energia || 5), 0) / ultimaSemana.length;
    const diasConsecutivos = calcularDiasConsecutivos();
    
    return {
      total: entradas.length,
      ultimaSemana: ultimaSemana.length,
      promedioEnergia: promedioEnergia.toFixed(1),
      diasConsecutivos
    };
  };

  const calcularDiasConsecutivos = () => {
    if (entradas.length === 0) return 0;
    
    let consecutivos = 1;
    const fechasOrdenadas = entradas
      .map(e => new Date(e.fecha))
      .sort((a, b) => b - a);
    
    for (let i = 0; i < fechasOrdenadas.length - 1; i++) {
      const diff = (fechasOrdenadas[i] - fechasOrdenadas[i + 1]) / (1000 * 60 * 60 * 24);
      if (diff === 1) {
        consecutivos++;
      } else {
        break;
      }
    }
    
    return consecutivos;
  };

  const emojis = {
    'muy_feliz': '😄',
    'feliz': '😊',
    'neutral': '😐',
    'triste': '😔',
    'muy_triste': '😢'
  };

  if (loading) {
    return (
      <div className="diario-loading">
        <div className="spinner"></div>
        <p>Cargando diario...</p>
      </div>
    );
  }

  const stats = obtenerEstadisticas();

  return (
    <div className="diario-container">
      <div className="diario-header">
        <h2>📔 Diario de Reflexión</h2>
        <button
          onClick={() => setVistaHistorial(!vistaHistorial)}
          className="btn-vista"
        >
          {vistaHistorial ? '✍️ Nueva Entrada' : '📚 Ver Historial'}
        </button>
      </div>

      {/* Estadísticas */}
      {stats && (
        <div className="diario-stats">
          <div className="stat-card">
            <span className="stat-emoji">📝</span>
            <span className="stat-numero">{stats.total}</span>
            <span className="stat-texto">Entradas</span>
          </div>
          <div className="stat-card">
            <span className="stat-emoji">🔥</span>
            <span className="stat-numero">{stats.diasConsecutivos}</span>
            <span className="stat-texto">Días seguidos</span>
          </div>
          <div className="stat-card">
            <span className="stat-emoji">⚡</span>
            <span className="stat-numero">{stats.promedioEnergia}/10</span>
            <span className="stat-texto">Energía promedio</span>
          </div>
        </div>
      )}

      {!vistaHistorial ? (
        /* Formulario de entrada */
        <form onSubmit={handleGuardar} className="diario-form">
          {/* Selector de fecha */}
          <div className="form-group">
            <label>📅 Fecha de la reflexión</label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="input-fecha"
            />
          </div>

          {/* Selector de emoción */}
          <div className="form-group">
            <label>¿Cómo te sientes hoy?</label>
            <div className="emociones-selector">
              {Object.entries(emojis).map(([key, emoji]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setEmocion(key)}
                  className={`emocion-btn ${emocion === key ? 'activo' : ''}`}
                >
                  <span className="emocion-emoji">{emoji}</span>
                  <span className="emocion-texto">
                    {key.replace('_', ' ').charAt(0).toUpperCase() + key.slice(1).replace('_', ' ')}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Nivel de energía */}
          <div className="form-group">
            <label>⚡ Nivel de energía: {energia}/10</label>
            <input
              type="range"
              min="1"
              max="10"
              value={energia}
              onChange={(e) => setEnergia(parseInt(e.target.value))}
              className="slider-energia"
            />
            <div className="energia-labels">
              <span>Baja</span>
              <span>Media</span>
              <span>Alta</span>
            </div>
          </div>

          {/* Aspectos positivos */}
          <div className="form-group">
            <label>✨ ¿Qué salió bien hoy?</label>
            <textarea
              value={positivo}
              onChange={(e) => setPositivo(e.target.value)}
              placeholder="Describe los momentos positivos, logros o cosas por las que estás agradecido..."
              className="textarea-reflexion"
              rows="4"
            />
          </div>

          {/* Aspectos a mejorar */}
          <div className="form-group">
            <label>🎯 ¿Qué podrías mejorar?</label>
            <textarea
              value={mejorar}
              onChange={(e) => setMejorar(e.target.value)}
              placeholder="Reflexiona sobre los desafíos y cómo podrías manejarlos mejor..."
              className="textarea-reflexion"
              rows="4"
            />
          </div>

          {/* Botones de acción */}
          <div className="form-actions">
            <button type="submit" className="btn-guardar">
              {editando ? '💾 Actualizar Reflexión' : '💾 Guardar Reflexión'}
            </button>
            {editando && (
              <>
                <button
                  type="button"
                  onClick={() => handleEliminar(editando)}
                  className="btn-eliminar"
                >
                  🗑️ Eliminar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFecha(new Date().toISOString().split('T')[0]);
                    limpiarFormulario();
                  }}
                  className="btn-nueva"
                >
                  ➕ Nueva Entrada
                </button>
              </>
            )}
          </div>
        </form>
      ) : (
        /* Vista de historial */
        <div className="diario-historial">
          {entradas.length === 0 ? (
            <div className="sin-entradas">
              <p>📝 No hay entradas en tu diario aún</p>
              <p>¡Comienza escribiendo tu primera reflexión!</p>
            </div>
          ) : (
            <div className="entradas-lista">
              {entradas.map(entrada => (
                <div key={entrada.id} className="entrada-card">
                  <div className="entrada-header">
                    <span className="entrada-fecha">
                      {new Date(entrada.fecha).toLocaleDateString('es-ES', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                    <div className="entrada-estado">
                      <span className="entrada-emocion">{emojis[entrada.emocion || 'neutral']}</span>
                      <span className="entrada-energia">⚡ {entrada.energia || 5}/10</span>
                    </div>
                  </div>
                  
                  <div className="entrada-contenido">
                    {entrada.positivo && (
                      <div className="entrada-seccion">
                        <h4>✨ Lo positivo:</h4>
                        <p>{entrada.positivo}</p>
                      </div>
                    )}
                    {entrada.mejorar && (
                      <div className="entrada-seccion">
                        <h4>🎯 A mejorar:</h4>
                        <p>{entrada.mejorar}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="entrada-actions">
                    <button
                      onClick={() => {
                        setFecha(entrada.fecha);
                        setVistaHistorial(false);
                      }}
                      className="btn-editar-entrada"
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => handleEliminar(entrada.id)}
                      className="btn-eliminar-entrada"
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DiarioReflexion;

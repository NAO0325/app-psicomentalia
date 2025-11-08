// Vista presentacional de DiarioReflexion: solo UI, sin efectos
import React from 'react';

export default function View({
  loading,
  fecha,
  setFecha,
  positivo,
  setPositivo,
  mejorar,
  setMejorar,
  emocion,
  setEmocion,
  energia,
  setEnergia,
  editando,
  setEditando,
  vistaHistorial,
  setVistaHistorial,
  onGuardar,
  onEliminar,
  limpiarFormulario,
  stats,
  emojis,
  entradas
}) {
  if (loading) {
    return (
      <div className="diario-loading">
        <div className="spinner"></div>
        <p>Cargando diario...</p>
      </div>
    );
  }

  return (
    <div className="diario-container">
      <div className="diario-header">
        <h2>📔 Diario de Reflexión</h2>
        <button onClick={() => setVistaHistorial(!vistaHistorial)} className="btn-vista">
          {vistaHistorial ? '✍️ Nueva Entrada' : '📚 Ver Historial'}
        </button>
      </div>

      {stats && (
        <div className="diario-stats">
          <div className="stat-card"><span className="stat-emoji">📝</span><span className="stat-numero">{stats.total}</span><span className="stat-texto">Entradas</span></div>
          <div className="stat-card"><span className="stat-emoji">🔥</span><span className="stat-numero">{stats.diasConsecutivos}</span><span className="stat-texto">Días seguidos</span></div>
          <div className="stat-card"><span className="stat-emoji">⚡</span><span className="stat-numero">{stats.promedioEnergia}/10</span><span className="stat-texto">Energía promedio</span></div>
        </div>
      )}

      {!vistaHistorial ? (
        <form onSubmit={onGuardar} className="diario-form">
          <div className="form-group">
            <label>📅 Fecha de la reflexión</label>
            <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} max={new Date().toISOString().split('T')[0]} className="input-fecha" />
          </div>

          <div className="form-group">
            <label>¿Cómo te sientes hoy?</label>
            <div className="emocion-selector">
              {[
                { key: 'muy_feliz', label: 'Muy feliz', icon: '😄' },
                { key: 'feliz', label: 'Feliz', icon: '😊' },
                { key: 'neutral', label: 'Neutral', icon: '😐' },
                { key: 'triste', label: 'Triste', icon: '😔' },
                { key: 'muy_triste', label: 'Muy triste', icon: '😢' }
              ].map(opt => (
                <button key={opt.key} type="button" className={`emocion-btn ${emocion === opt.key ? 'activa' : ''}`} onClick={() => setEmocion(opt.key)} data-emotion={opt.key}>
                  <span className="emoji">{opt.icon}</span>
                  <span className="label">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>⚡ Nivel de energía: {energia}/10</label>
            <input type="range" min="1" max="10" value={energia} onChange={(e) => setEnergia(parseInt(e.target.value))} className="slider-energia" />
            <div className="energia-labels"><span>Baja</span><span>Media</span><span>Alta</span></div>
          </div>

          <div className="form-group">
            <label>✨ ¿Qué salió bien hoy?</label>
            <textarea value={positivo} onChange={(e) => setPositivo(e.target.value)} placeholder="Describe los momentos positivos, logros o cosas por las que estás agradecido..." className="textarea-reflexion" rows="4" />
          </div>

          <div className="form-group">
            <label>🎯 ¿Qué podrías mejorar?</label>
            <textarea value={mejorar} onChange={(e) => setMejorar(e.target.value)} placeholder="Reflexiona sobre los desafíos y cómo podrías manejarlos mejor..." className="textarea-reflexion" rows="4" />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-guardar">{editando ? '💾 Actualizar Reflexión' : '💾 Guardar Reflexión'}</button>
            {editando && (
              <>
                <button type="button" onClick={() => onEliminar(editando)} className="btn-limpiar">🗑️ Eliminar</button>
                <button type="button" onClick={() => { setFecha(new Date().toISOString().split('T')[0]); limpiarFormulario(); }} className="btn-nueva">➕ Nueva Entrada</button>
              </>
            )}
          </div>
        </form>
      ) : (
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
                      {new Date(entrada.fecha).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
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
                    <button onClick={() => { setFecha(entrada.fecha); setVistaHistorial(false); }} className="btn-editar-entrada">✏️ Editar</button>
                    <button onClick={() => onEliminar(entrada.id)} className="btn-eliminar-entrada">🗑️ Eliminar</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Vista presentacional de TipsBienestar: renderiza filtros y tarjetas
import React from 'react';

export default function View({ categorias, categoriaActiva, setCategoriaActiva, tips }) {
  return (
    <div className="tips-container">
      <div className="tips-header">
        <h2>💡 Tips de Bienestar para TDAH</h2>
        <p>Estrategias prácticas para mejorar tu día a día</p>
      </div>

      <div className="categorias-filter">
        {categorias.map(cat => (
          <button key={cat.id} onClick={() => setCategoriaActiva(cat.id)} className={`categoria-btn ${categoriaActiva === cat.id ? 'activo' : ''}`}>
            <span>{cat.emoji}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      <div className="tips-grid">
        {tips.map(tip => (
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
            Cada persona con TDAH es única. Experimenta con diferentes estrategias y quédate con las que mejor funcionen para ti. El progreso, no la perfección, es la meta.
          </p>
        </div>
      </div>
    </div>
  );
}

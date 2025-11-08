// Vista presentacional de Dashboard: solo renderiza con props
import React from 'react';
import { Link } from 'react-router-dom';

export default function View({ greeting, dateText, sections, stats, quote }) {
  return (
    <div className="dashboard-container">
      <div className="dashboard-welcome">
        <h1>{greeting}</h1>
        <p className="dashboard-date">{dateText}</p>
      </div>

      <div className="dashboard-sections">
        {sections.map((section) => (
          <Link
            key={section.id}
            to={section.path}
            className="dashboard-section-card"
            style={{ background: section.gradient }}
          >
            <div className="section-card-icon">{section.icon}</div>
            <div className="section-card-content">
              <h3>{section.title}</h3>
              <p>{section.description}</p>
            </div>
            <div className="section-card-arrow">→</div>
          </Link>
        ))}
      </div>

      <div className="dashboard-summary">
        <h2>📊 Resumen Rápido</h2>
        <div className="summary-stats">
          {stats.map((stat, index) => (
            <div key={index} className="summary-stat-card">
              <div className="stat-icon" style={{ backgroundColor: `${stat.color}15` }}>
                <span style={{ fontSize: '2rem' }}>{stat.icon}</span>
              </div>
              <div className="stat-content">
                <div className="stat-value" style={{ color: stat.color }}>
                  {stat.value}
                </div>
                <div className="stat-label">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="dashboard-quote">
        <div className="quote-content">
          <p className="quote-text">{quote.text}</p>
          <p className="quote-author">- {quote.author}</p>
        </div>
      </div>
    </div>
  );
}

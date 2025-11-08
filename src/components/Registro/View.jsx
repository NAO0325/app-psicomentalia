// Vista presentacional: renderiza el formulario, recibe datos/handlers por props
import React from 'react';
import { Link } from 'react-router-dom';

export default function View({
  formData,
  loading,
  error,
  onChange,
  onSubmit,
  onGoogleRegister,
  passwordStrengthClass,
  passwordStrengthText
}) {
  return (
    <div className="registro-container">
      <div className="registro-card">
        <div className="registro-header">
          <h1>🧠 Herramientas TDAH</h1>
          <p>Crea tu cuenta y comienza a organizarte mejor</p>
        </div>

        <form onSubmit={onSubmit} className="registro-form" noValidate>
          <h2>Crear Cuenta</h2>

          {error && (
            <div className="alert alert-error" role="alert">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="displayName">
              <span>👤</span>
              <span>Nombre Completo</span>
            </label>
            <input
              type="text"
              id="displayName"
              name="displayName"
              value={formData.displayName}
              onChange={(e) => onChange('displayName', e.target.value)}
              placeholder="Tu nombre"
              required
              disabled={loading}
              autoComplete="name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">
              <span>📧</span>
              <span>Correo Electrónico</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={(e) => onChange('email', e.target.value)}
              placeholder="tu@email.com"
              required
              disabled={loading}
              autoComplete="email"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck="false"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              <span>🔒</span>
              <span>Contraseña</span>
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={(e) => onChange('password', e.target.value)}
              placeholder="Mínimo 6 caracteres"
              required
              disabled={loading}
              autoComplete="new-password"
            />
            {formData.password && (
              <>
                <div className="password-strength">
                  <div className={`password-strength-bar ${passwordStrengthClass}`} />
                </div>
                <div className="password-strength-text">
                  Seguridad: <strong>{passwordStrengthText}</strong>
                </div>
              </>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">
              <span>🔒</span>
              <span>Confirmar Contraseña</span>
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={(e) => onChange('confirmPassword', e.target.value)}
              placeholder="Repite tu contraseña"
              required
              disabled={loading}
              autoComplete="new-password"
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-small"></span>
                <span>Creando cuenta...</span>
              </>
            ) : (
              <span>Crear Cuenta</span>
            )}
          </button>

          <div className="divider">
            <span>O</span>
          </div>

          <button type="button" onClick={onGoogleRegister} className="btn btn-google" disabled={loading}>
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              width="20"
              height="20"
            />
            <span>Registrarse con Google</span>
          </button>
        </form>

        <div className="registro-footer">
          <p>
            ¿Ya tienes cuenta?
            <Link to="/login"> Inicia sesión aquí</Link>
          </p>
        </div>

        <div className="terms-privacy">
          Al crear una cuenta, aceptas nuestros{' '}
          <a href="/terminos" target="_blank" rel="noopener noreferrer">
            Términos de Servicio
          </a>{' '}
          y{' '}
          <a href="/privacidad" target="_blank" rel="noopener noreferrer">
            Política de Privacidad
          </a>
        </div>
      </div>
    </div>
  );
}

// Vista presentacional: solo recibe props y renderiza JSX
import React from 'react';
import { Link } from 'react-router-dom';

export default function View({
  email,
  password,
  loading,
  error,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onGoogleLogin,
  showDevInfo
}) {
  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>🧠 Herramientas TDAH</h1>
          <p>Tu apoyo diario para una mejor organización</p>
        </div>

        <form onSubmit={onSubmit} className="login-form" noValidate>
          <h2>Iniciar Sesión</h2>

          {error && (
            <div className="alert alert-error" role="alert">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">
              <span>📧</span>
              <span>Correo Electrónico</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
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
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              placeholder="Tu contraseña"
              required
              disabled={loading}
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-small"></span>
                <span>Iniciando...</span>
              </>
            ) : (
              <span>Iniciar Sesión</span>
            )}
          </button>

          <div className="divider">
            <span>O</span>
          </div>

          <button type="button" onClick={onGoogleLogin} className="btn btn-google" disabled={loading}>
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              width="20"
              height="20"
            />
            <span>Continuar con Google</span>
          </button>
        </form>

        <div className="login-footer">
          <p>
            ¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
          </p>
          <Link to="/reset-password" className="forgot-password">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        {showDevInfo && (
          <div className="dev-info">
            <p>🔧 Modo desarrollo - Credenciales de prueba:</p>
            <code>test@example.com / password123</code>
          </div>
        )}
      </div>
    </div>
  );
}

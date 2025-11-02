// src/components/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setError(
        error.code === 'auth/user-not-found' 
          ? 'Usuario no encontrado' 
          : error.code === 'auth/wrong-password'
          ? 'Contraseña incorrecta'
          : 'Error al iniciar sesión. Por favor intenta de nuevo.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);

    try {
      await loginWithGoogle();
      navigate('/');
    } catch (error) {
      console.error('Error con Google:', error);
      setError('Error al iniciar sesión con Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>🧠 Herramientas TDAH</h1>
          <p>Tu apoyo diario para una mejor organización</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <h2>Iniciar Sesión</h2>
          
          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">📧 Correo Electrónico</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">🔒 Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Tu contraseña"
              required
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-small"></span>
                Iniciando...
              </>
            ) : (
              'Iniciar Sesión'
            )}
          </button>

          <div className="divider">
            <span>O</span>
          </div>

          <button 
            type="button"
            onClick={handleGoogleLogin}
            className="btn btn-google"
            disabled={loading}
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
            Continuar con Google
          </button>
        </form>

        <div className="login-footer">
          <p>
            ¿No tienes cuenta? 
            <Link to="/registro"> Regístrate aquí</Link>
          </p>
          <Link to="/reset-password" className="forgot-password">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        {/* Credenciales de prueba para desarrollo */}
        {process.env.NODE_ENV === 'development' && (
          <div className="dev-info">
            <p>🔧 Modo desarrollo - Credenciales de prueba:</p>
            <code>test@example.com / password123</code>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;

// src/components/Login.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  // Limpiar error después de 5 segundos
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!email || !password) {
      setError('Por favor completa todos los campos');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await login(email, password);
      // Pequeño delay antes de navegar para asegurar que el estado se actualice
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 100);
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      
      // Mensajes de error más amigables
      let errorMessage = 'Error al iniciar sesión. Por favor intenta de nuevo.';
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No existe una cuenta con este correo electrónico';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Contraseña incorrecta';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'El correo electrónico no es válido';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Demasiados intentos fallidos. Por favor intenta más tarde';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Error de conexión. Verifica tu internet';
      } else if (error.code === 'auth/invalid-credential') {
        errorMessage = 'Credenciales incorrectas. Verifica tu email y contraseña';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);

    try {
      await loginWithGoogle();
      // Pequeño delay antes de navegar
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 100);
    } catch (error) {
      console.error('Error con Google:', error);
      
      let errorMessage = 'Error al iniciar sesión con Google';
      
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Inicio de sesión cancelado';
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = 'Popup bloqueado. Permite popups para este sitio';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Error de conexión. Verifica tu internet';
      }
      
      setError(errorMessage);
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

        <form onSubmit={handleSubmit} className="login-form" noValidate>
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
              onChange={(e) => setEmail(e.target.value)}
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
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Tu contraseña"
              required
              disabled={loading}
              autoComplete="current-password"
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
                <span>Iniciando...</span>
              </>
            ) : (
              <span>Iniciar Sesión</span>
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
            ¿No tienes cuenta? 
            <Link to="/registro"> Regístrate aquí</Link>
          </p>
          <Link to="/reset-password" className="forgot-password">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        {/* Credenciales de prueba para desarrollo con emuladores */}
        {import.meta.env.DEV && import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true' && (
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
// src/components/Registro.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Registro = () => {
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  // Limpiar error después de 5 segundos
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Calcular fuerza de contraseña
  useEffect(() => {
    const password = formData.password;
    let strength = 0;
    
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    setPasswordStrength(Math.min(strength, 3)); // Máximo 3 para el indicador
  }, [formData.password]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.displayName.trim()) {
      setError('Por favor ingresa tu nombre');
      return false;
    }
    
    if (!formData.email) {
      setError('Por favor ingresa tu correo electrónico');
      return false;
    }
    
    if (!formData.password) {
      setError('Por favor ingresa una contraseña');
      return false;
    }
    
    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setError('');
    setLoading(true);

    try {
      await register(formData.email, formData.password, formData.displayName);
      // Pequeño delay antes de navegar
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 100);
    } catch (error) {
      console.error('Error al registrarse:', error);
      
      let errorMessage = 'Error al crear la cuenta. Por favor intenta de nuevo.';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Este correo electrónico ya está registrado';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'El correo electrónico no es válido';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'La contraseña es muy débil. Usa al menos 6 caracteres';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Error de conexión. Verifica tu internet';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setError('');
    setLoading(true);

    try {
      await loginWithGoogle();
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 100);
    } catch (error) {
      console.error('Error con Google:', error);
      
      let errorMessage = 'Error al registrarse con Google';
      
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Registro cancelado';
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = 'Popup bloqueado. Permite popups para este sitio';
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        errorMessage = 'Ya existe una cuenta con este correo';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrengthClass = () => {
    if (passwordStrength === 0) return '';
    if (passwordStrength === 1) return 'weak';
    if (passwordStrength === 2) return 'medium';
    return 'strong';
  };

  const getPasswordStrengthText = () => {
    if (!formData.password) return '';
    if (passwordStrength <= 1) return 'Débil';
    if (passwordStrength === 2) return 'Media';
    return 'Fuerte';
  };

  return (
    <div className="registro-container">
      <div className="registro-card">
        <div className="registro-header">
          <h1>🧠 Herramientas TDAH</h1>
          <p>Crea tu cuenta y comienza a organizarte mejor</p>
        </div>

        <form onSubmit={handleSubmit} className="registro-form" noValidate>
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
              onChange={handleChange}
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
              onChange={handleChange}
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
              onChange={handleChange}
              placeholder="Mínimo 6 caracteres"
              required
              disabled={loading}
              autoComplete="new-password"
            />
            {formData.password && (
              <>
                <div className="password-strength">
                  <div 
                    className={`password-strength-bar ${getPasswordStrengthClass()}`}
                  />
                </div>
                <div className="password-strength-text">
                  Seguridad: <strong>{getPasswordStrengthText()}</strong>
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
              onChange={handleChange}
              placeholder="Repite tu contraseña"
              required
              disabled={loading}
              autoComplete="new-password"
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
                <span>Creando cuenta...</span>
              </>
            ) : (
              <span>Crear Cuenta</span>
            )}
          </button>

          <div className="divider">
            <span>O</span>
          </div>

          <button 
            type="button"
            onClick={handleGoogleRegister}
            className="btn btn-google"
            disabled={loading}
          >
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
};

export default Registro;
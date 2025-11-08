// Contenedor de Login: maneja estado y navegación, delega UI a View
import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import View from './View.jsx';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { user, login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const showDevInfo = useMemo(
    () => import.meta.env.DEV && import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true',
    []
  );

  useEffect(() => {
    if (user) navigate('/', { replace: true });
  }, [user, navigate]);

  useEffect(() => {
    if (!error) return;
    const t = setTimeout(() => setError(''), 5000);
    return () => clearTimeout(t);
  }, [error]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) {
      setError('Por favor completa todos los campos');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      // La navegación la realiza el efecto de user
    } catch (err) {
      console.error('Error al iniciar sesión:', err);
      let msg = 'Error al iniciar sesión. Por favor intenta de nuevo.';
      if (err?.code === 'auth/user-not-found') msg = 'No existe una cuenta con este correo electrónico';
      else if (err?.code === 'auth/wrong-password') msg = 'Contraseña incorrecta';
      else if (err?.code === 'auth/invalid-email') msg = 'El correo electrónico no es válido';
      else if (err?.code === 'auth/too-many-requests') msg = 'Demasiados intentos fallidos. Por favor intenta más tarde';
      else if (err?.code === 'auth/network-request-failed') msg = 'Error de conexión. Verifica tu internet';
      else if (err?.code === 'auth/invalid-credential') msg = 'Credenciales incorrectas. Verifica tu email y contraseña';
      setError(msg);
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setError('');
    setLoading(true);
    try {
      await loginWithGoogle();
      // La navegación la realiza el efecto de user
    } catch (err) {
      console.error('Error con Google:', err);
      let msg = 'Error al iniciar sesión con Google';
      if (err?.code === 'auth/popup-closed-by-user') msg = 'Inicio de sesión cancelado';
      else if (err?.code === 'auth/popup-blocked') msg = 'Popup bloqueado. Permite popups para este sitio';
      else if (err?.code === 'auth/network-request-failed') msg = 'Error de conexión. Verifica tu internet';
      setError(msg);
      setLoading(false);
    }
  }

  return (
    <View
      email={email}
      password={password}
      loading={loading}
      error={error}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      onSubmit={handleSubmit}
      onGoogleLogin={handleGoogleLogin}
      showDevInfo={showDevInfo}
    />
  );
}

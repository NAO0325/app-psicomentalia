// Contenedor de Registro: maneja estado, validación y handlers; delega la UI a View
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import View from './View.jsx';

function calcPasswordStrength(pwd) {
  let strength = 0;
  if (pwd.length >= 6) strength++;
  if (pwd.length >= 8) strength++;
  if (/[A-Z]/.test(pwd)) strength++;
  if (/[0-9]/.test(pwd)) strength++;
  if (/[^A-Za-z0-9]/.test(pwd)) strength++;
  return Math.min(strength, 3);
}

export default function Registro() {
  const [formData, setFormData] = useState({ displayName: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);

  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const passwordStrengthClass = useMemo(() => {
    if (passwordStrength === 0) return '';
    if (passwordStrength === 1) return 'weak';
    if (passwordStrength === 2) return 'medium';
    return 'strong';
  }, [passwordStrength]);

  const passwordStrengthText = useMemo(() => {
    if (!formData.password) return '';
    if (passwordStrength <= 1) return 'Débil';
    if (passwordStrength === 2) return 'Media';
    return 'Fuerte';
  }, [passwordStrength, formData.password]);

  useEffect(() => {
    if (!error) return;
    const t = setTimeout(() => setError(''), 5000);
    return () => clearTimeout(t);
  }, [error]);

  useEffect(() => {
    setPasswordStrength(calcPasswordStrength(formData.password));
  }, [formData.password]);

  function handleChange(name, value) {
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  function validateForm() {
    if (!formData.displayName.trim()) return setError('Por favor ingresa tu nombre'), false;
    if (!formData.email) return setError('Por favor ingresa tu correo electrónico'), false;
    if (!formData.password) return setError('Por favor ingresa una contraseña'), false;
    if (formData.password.length < 6) return setError('La contraseña debe tener al menos 6 caracteres'), false;
    if (formData.password !== formData.confirmPassword) return setError('Las contraseñas no coinciden'), false;
    return true;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validateForm()) return;
    setError('');
    setLoading(true);
    try {
      await register(formData.email, formData.password, formData.displayName);
      setTimeout(() => navigate('/', { replace: true }), 100);
    } catch (err) {
      console.error('Error al registrarse:', err);
      let msg = 'Error al crear la cuenta. Por favor intenta de nuevo.';
      if (err?.code === 'auth/email-already-in-use') msg = 'Este correo electrónico ya está registrado';
      else if (err?.code === 'auth/invalid-email') msg = 'El correo electrónico no es válido';
      else if (err?.code === 'auth/weak-password') msg = 'La contraseña es muy débil. Usa al menos 6 caracteres';
      else if (err?.code === 'auth/network-request-failed') msg = 'Error de conexión. Verifica tu internet';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleRegister() {
    setError('');
    setLoading(true);
    try {
      await loginWithGoogle();
      setTimeout(() => navigate('/', { replace: true }), 100);
    } catch (err) {
      console.error('Error con Google:', err);
      let msg = 'Error al registrarse con Google';
      if (err?.code === 'auth/popup-closed-by-user') msg = 'Registro cancelado';
      else if (err?.code === 'auth/popup-blocked') msg = 'Popup bloqueado. Permite popups para este sitio';
      else if (err?.code === 'auth/account-exists-with-different-credential') msg = 'Ya existe una cuenta con este correo';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View
      formData={formData}
      loading={loading}
      error={error}
      onChange={handleChange}
      onSubmit={handleSubmit}
      onGoogleRegister={handleGoogleRegister}
      passwordStrengthClass={passwordStrengthClass}
      passwordStrengthText={passwordStrengthText}
    />
  );
}

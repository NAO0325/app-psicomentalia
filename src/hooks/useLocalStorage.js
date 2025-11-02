// src/hooks/useLocalStorage.js
// Hook para desarrollo LOCAL sin Firebase - usando localStorage

import { useState, useEffect } from 'react';

export const useLocalStorage = (key, defaultValue) => {
  // Obtener valor inicial de localStorage
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error);
      return defaultValue;
    }
  });

  // Guardar en localStorage cuando cambie el valor
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  }, [key, value]);

  return [value, setValue];
};

// Hook alternativo que simula Firebase pero usa localStorage
export const useLocalSync = (collectionName, defaultValue = []) => {
  const [data, setData] = useLocalStorage(`tdah-app-${collectionName}`, defaultValue);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Simular las funciones de Firebase
  const addDocument = async (newData) => {
    try {
      const newDoc = {
        id: Date.now().toString(),
        ...newData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: 'local-user'
      };
      
      setData(prev => [newDoc, ...prev]);
      return newDoc.id;
    } catch (err) {
      setError(err);
      return null;
    }
  };

  const updateDocument = async (docId, updates) => {
    try {
      setData(prev => 
        prev.map(doc => 
          doc.id === docId 
            ? { ...doc, ...updates, updatedAt: new Date().toISOString() }
            : doc
        )
      );
      return true;
    } catch (err) {
      setError(err);
      return false;
    }
  };

  const deleteDocument = async (docId) => {
    try {
      setData(prev => prev.filter(doc => doc.id !== docId));
      return true;
    } catch (err) {
      setError(err);
      return false;
    }
  };

  return {
    data,
    loading,
    error,
    addDocument,
    updateDocument,
    deleteDocument
  };
};

// Hook de autenticación local (simulado)
export const useLocalAuth = () => {
  const [user, setUser] = useLocalStorage('tdah-app-user', null);
  const [loading, setLoading] = useState(false);

  const register = async (email, password, displayName) => {
    setLoading(true);
    // Simular registro
    const newUser = {
      uid: Date.now().toString(),
      email,
      displayName,
      createdAt: new Date().toISOString()
    };
    setUser(newUser);
    setLoading(false);
    return newUser;
  };

  const login = async (email, password) => {
    setLoading(true);
    // Simular login (acepta cualquier credencial en desarrollo)
    const loggedUser = {
      uid: Date.now().toString(),
      email,
      displayName: email.split('@')[0],
      createdAt: new Date().toISOString()
    };
    setUser(loggedUser);
    setLoading(false);
    return loggedUser;
  };

  const logout = async () => {
    setUser(null);
    // Opcional: limpiar todos los datos locales
    // localStorage.clear();
  };

  return {
    user,
    loading,
    error: null,
    register,
    login,
    loginWithGoogle: login, // Simular login con Google
    logout,
    resetPassword: async () => console.log('Reset password simulado')
  };
};

// src/hooks/useAuth.js
import { useState, useEffect, createContext, useContext } from 'react';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

// Crear contexto de autenticación
const AuthContext = createContext({
  user: null,
  loading: true,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  loginWithGoogle: async () => {},
  resetPassword: async () => {},
  updateUserProfile: async () => {}
});

// Hook para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

// Proveedor de autenticación
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Suscribirse a cambios en el estado de autenticación
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // Usuario autenticado - obtener datos adicionales de Firestore
          const userDocRef = doc(db, 'usuarios', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            // Combinar datos de Firebase Auth con Firestore
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
              ...userDoc.data()
            });
          } else {
            // Si no existe documento en Firestore, usar solo datos de Auth
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL
            });
          }
        } else {
          // No hay usuario autenticado
          setUser(null);
        }
      } catch (err) {
        console.error('Error al obtener datos del usuario:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    });

    // Cleanup: desuscribirse al desmontar
    return () => unsubscribe();
  }, []);

  // Registrar usuario con email y contraseña
  const register = async (email, password, displayName) => {
    try {
      setError(null);
      setLoading(true);

      // Crear usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Actualizar el perfil con el nombre
      await updateProfile(firebaseUser, {
        displayName: displayName
      });

      // Crear documento en Firestore con datos adicionales
      const userDocRef = doc(db, 'usuarios', firebaseUser.uid);
      await setDoc(userDocRef, {
        uid: firebaseUser.uid,
        email: email,
        displayName: displayName,
        createdAt: new Date().toISOString(),
        preferences: {
          notifications: true,
          theme: 'light',
          reminderTime: '09:00'
        },
        stats: {
          tasksCompleted: 0,
          diaryEntries: 0,
          currentStreak: 0,
          maxStreak: 0
        }
      });

      return firebaseUser;
    } catch (err) {
      console.error('Error en registro:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Iniciar sesión con email y contraseña
  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (err) {
      console.error('Error en login:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Iniciar sesión con Google
  const loginWithGoogle = async () => {
    try {
      setError(null);
      setLoading(true);

      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });

      const userCredential = await signInWithPopup(auth, provider);
      const firebaseUser = userCredential.user;

      // Verificar si es un usuario nuevo
      const userDocRef = doc(db, 'usuarios', firebaseUser.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // Crear perfil para usuario nuevo de Google
        await setDoc(userDocRef, {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          createdAt: new Date().toISOString(),
          preferences: {
            notifications: true,
            theme: 'light',
            reminderTime: '09:00'
          },
          stats: {
            tasksCompleted: 0,
            diaryEntries: 0,
            currentStreak: 0,
            maxStreak: 0
          }
        });
      }

      return firebaseUser;
    } catch (err) {
      console.error('Error con Google login:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Cerrar sesión
  const logout = async () => {
    try {
      setError(null);
      await signOut(auth);
      setUser(null);
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
      setError(err.message);
      throw err;
    }
  };

  // Restablecer contraseña
  const resetPassword = async (email) => {
    try {
      setError(null);
      await sendPasswordResetEmail(auth, email);
      return true;
    } catch (err) {
      console.error('Error al restablecer contraseña:', err);
      setError(err.message);
      throw err;
    }
  };

  // Actualizar perfil de usuario
  const updateUserProfile = async (updates) => {
    try {
      setError(null);
      
      if (!user) {
        throw new Error('No hay usuario autenticado');
      }

      // Actualizar en Firestore
      const userDocRef = doc(db, 'usuarios', user.uid);
      await updateDoc(userDocRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      });

      // Actualizar en Firebase Auth si hay cambios en displayName o photoURL
      if (updates.displayName || updates.photoURL) {
        await updateProfile(auth.currentUser, {
          displayName: updates.displayName || auth.currentUser.displayName,
          photoURL: updates.photoURL || auth.currentUser.photoURL
        });
      }

      // Actualizar estado local
      setUser(prev => ({
        ...prev,
        ...updates
      }));

      return true;
    } catch (err) {
      console.error('Error al actualizar perfil:', err);
      setError(err.message);
      throw err;
    }
  };

  // Valor del contexto
  const value = {
    user,
    loading,
    error,
    register,
    login,
    loginWithGoogle,
    logout,
    resetPassword,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
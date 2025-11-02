// src/hooks/useFirebaseSync.js
import { useState, useEffect } from 'react';
import { 
  collection, 
  doc, 
  onSnapshot, 
  setDoc, 
  addDoc,
  deleteDoc,
  query,
  where,
  orderBy 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './useAuth';

export const useFirebaseSync = (collectionName, defaultValue = []) => {
  const [data, setData] = useState(defaultValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setData(defaultValue);
      setLoading(false);
      return;
    }

    setLoading(true);

    // Crear query para obtener solo los datos del usuario actual
    const q = query(
      collection(db, collectionName),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    // Suscribirse a cambios en tiempo real
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items = [];
        snapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() });
        });
        setData(items);
        setLoading(false);
      },
      (err) => {
        console.error('Error al sincronizar con Firebase:', err);
        setError(err);
        setLoading(false);
      }
    );

    // Limpiar suscripción al desmontar
    return () => unsubscribe();
  }, [collectionName, user]);

  // Función para agregar un documento
  const addDocument = async (newData) => {
    if (!user) {
      setError(new Error('Usuario no autenticado'));
      return null;
    }

    try {
      const docData = {
        ...newData,
        userId: user.uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const docRef = await addDoc(collection(db, collectionName), docData);
      return docRef.id;
    } catch (err) {
      console.error('Error al agregar documento:', err);
      setError(err);
      return null;
    }
  };

  // Función para actualizar un documento
  const updateDocument = async (docId, updates) => {
    if (!user) {
      setError(new Error('Usuario no autenticado'));
      return false;
    }

    try {
      const docRef = doc(db, collectionName, docId);
      await setDoc(docRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      return true;
    } catch (err) {
      console.error('Error al actualizar documento:', err);
      setError(err);
      return false;
    }
  };

  // Función para eliminar un documento
  const deleteDocument = async (docId) => {
    if (!user) {
      setError(new Error('Usuario no autenticado'));
      return false;
    }

    try {
      await deleteDoc(doc(db, collectionName, docId));
      return true;
    } catch (err) {
      console.error('Error al eliminar documento:', err);
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

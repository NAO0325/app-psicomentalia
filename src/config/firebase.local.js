// src/config/firebase.local.js
// Configuración para desarrollo LOCAL con Firebase Emulator

import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

// Configuración de Firebase (puedes usar cualquier valor para desarrollo local)
const firebaseConfig = {
  apiKey: "demo-api-key",
  authDomain: "demo-app-tdah.firebaseapp.com",
  projectId: "demo-app-tdah",  // IMPORTANTE: debe ser "demo-app-tdah"
  storageBucket: "demo-app-tdah.appspot.com",
  messagingSenderId: "123456789",
  appId: "demo-app-id"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Servicios de Firebase
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Conectar a los emuladores locales
if (window.location.hostname === 'localhost') {
  // Auth emulator
  connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
  
  // Firestore emulator
  connectFirestoreEmulator(db, 'localhost', 8080);
  
  // Storage emulator (opcional)
  connectStorageEmulator(storage, 'localhost', 9199);
  
  console.log('🔧 Usando Firebase Emulators locales');
}

export default app;

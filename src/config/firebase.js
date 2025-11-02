// src/config/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, enableIndexedDbPersistence } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

// Detectar modo desde variables de entorno
const mode = import.meta.env.VITE_DB_MODE || 'emulator';

let firebaseConfig;
let app, auth, db, storage;

if (mode === 'emulator') {
  // Configuración para emulador LOCAL
  firebaseConfig = {
    apiKey: "demo-api-key",
    authDomain: "demo-app-tdah.firebaseapp.com",
    projectId: "demo-app-tdah",
    storageBucket: "demo-app-tdah.appspot.com",
    messagingSenderId: "123456789",
    appId: "demo-app-id"
  };
  
  // Inicializar Firebase
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  
  // Conectar a emuladores LOCALES
  connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
  connectFirestoreEmulator(db, 'localhost', 8080);
  connectStorageEmulator(storage, 'localhost', 9199);
  
  console.log('🔧 Usando Firebase Emulators locales');
  
} else {
  // Configuración para PRODUCCIÓN (cuando la necesites)
  firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
  };
  
  // Inicializar Firebase
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  
  // Habilitar persistencia offline para producción
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.log('Persistencia offline no habilitada - múltiples pestañas abiertas');
    } else if (err.code === 'unimplemented') {
      console.log('El navegador no soporta persistencia offline');
    }
  });
  
  console.log('☁️ Usando Firebase Production');
}

// Exportar servicios
export { auth, db, storage };
export default app;
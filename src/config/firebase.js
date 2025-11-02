// src/config/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { 
  getFirestore, 
  connectFirestoreEmulator, 
  enableIndexedDbPersistence,
  CACHE_SIZE_UNLIMITED 
} from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

// Detectar modo desde variables de entorno
const USE_EMULATOR = import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true';
const isDevelopment = import.meta.env.DEV;

let app, auth, db, storage;

// Configuración de Firebase
if (USE_EMULATOR || (isDevelopment && !import.meta.env.VITE_FIREBASE_API_KEY)) {
  // ==================== MODO EMULADOR LOCAL ====================
  console.log('🔧 Inicializando Firebase en modo EMULADOR');
  
  const emulatorConfig = {
    apiKey: "demo-api-key",
    authDomain: "demo-app-tdah.firebaseapp.com",
    projectId: "demo-app-tdah",
    storageBucket: "demo-app-tdah.appspot.com",
    messagingSenderId: "123456789",
    appId: "demo-app-id"
  };

  // Inicializar Firebase con configuración del emulador
  app = initializeApp(emulatorConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);

  // Conectar a emuladores LOCALES
  try {
    connectAuthEmulator(auth, 'http://localhost:9099', { 
      disableWarnings: true 
    });
    connectFirestoreEmulator(db, 'localhost', 8080);
    connectStorageEmulator(storage, 'localhost', 9199);
    
    console.log('✅ Emuladores conectados exitosamente');
    console.log('   - Auth: http://localhost:9099');
    console.log('   - Firestore: http://localhost:8080');
    console.log('   - Storage: http://localhost:9199');
    console.log('   - UI: http://localhost:4000');
  } catch (error) {
    console.error('❌ Error al conectar emuladores:', error);
  }
} else {
  // ==================== MODO PRODUCCIÓN ====================
  console.log('☁️ Inicializando Firebase en modo PRODUCCIÓN');
  
  const productionConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
  };

  // Validar que todas las credenciales estén presentes
  const missingVars = Object.entries(productionConfig)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    console.error('❌ Variables de Firebase faltantes:', missingVars);
    throw new Error(`Faltan las siguientes variables de entorno: ${missingVars.join(', ')}`);
  }

  // Inicializar Firebase con configuración de producción
  app = initializeApp(productionConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);

  // Habilitar persistencia offline para producción
  enableIndexedDbPersistence(db, {
    cacheSizeBytes: CACHE_SIZE_UNLIMITED
  })
    .then(() => {
      console.log('✅ Persistencia offline habilitada');
    })
    .catch((err) => {
      if (err.code === 'failed-precondition') {
        console.warn('⚠️ Persistencia offline no habilitada - múltiples pestañas abiertas');
      } else if (err.code === 'unimplemented') {
        console.warn('⚠️ El navegador no soporta persistencia offline');
      } else {
        console.error('❌ Error al habilitar persistencia:', err);
      }
    });

  console.log('✅ Firebase inicializado correctamente');
}

// Configuración adicional para desarrollo
if (isDevelopment) {
  // Habilitar logging detallado en desarrollo
  console.log('📋 Configuración de Firebase:');
  console.log('   - Proyecto:', app.options.projectId);
  console.log('   - Auth Domain:', app.options.authDomain);
  console.log('   - Modo:', USE_EMULATOR ? 'Emulador' : 'Producción');
}

// Exportar servicios
export { auth, db, storage, app };

// Exportar una función para verificar el estado de conexión
export const checkFirebaseConnection = async () => {
  try {
    // Intentar obtener el usuario actual
    const currentUser = auth.currentUser;
    return {
      connected: true,
      user: currentUser,
      mode: USE_EMULATOR ? 'emulator' : 'production'
    };
  } catch (error) {
    return {
      connected: false,
      error: error.message,
      mode: USE_EMULATOR ? 'emulator' : 'production'
    };
  }
};

export default app;
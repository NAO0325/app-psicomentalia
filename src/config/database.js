// src/config/database.js
// Configuración adaptable para diferentes modos de base de datos

import { useLocalSync, useLocalAuth } from '../hooks/useLocalStorage';
import { useFirebaseSync } from '../hooks/useFirebaseSync';
import { useAuth as useFirebaseAuth } from '../hooks/useAuth';

// Determinar qué modo usar basado en variables de entorno
const DB_MODE = import.meta.env.VITE_DB_MODE || 'localStorage';

console.log(`🔧 Modo de base de datos: ${DB_MODE}`);

// Exportar los hooks apropiados según el modo
export const useDataSync = DB_MODE === 'localStorage' ? useLocalSync : useFirebaseSync;
export const useAuth = DB_MODE === 'localStorage' ? useLocalAuth : useFirebaseAuth;

// Configuración de Firebase si se necesita
if (DB_MODE === 'firebase' || DB_MODE === 'emulator') {
  if (DB_MODE === 'emulator') {
    console.log('📦 Usando Firebase Emulator Suite');
    // El archivo firebase.local.js ya maneja la conexión a emuladores
    import('./firebase.local.js');
  } else {
    console.log('☁️ Usando Firebase en la nube');
    import('./firebase.js');
  }
}

// Información del modo actual para debugging
export const getDatabaseInfo = () => {
  return {
    mode: DB_MODE,
    isLocal: DB_MODE === 'localStorage',
    isEmulator: DB_MODE === 'emulator',
    isProduction: DB_MODE === 'firebase'
  };
};

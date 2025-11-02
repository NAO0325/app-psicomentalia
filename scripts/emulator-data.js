// emulator-data.js
// Script para cargar datos de ejemplo en el emulador

import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  connectFirestoreEmulator,
  collection,
  addDoc,
  setDoc,
  doc
} from 'firebase/firestore';
import { 
  getAuth, 
  connectAuthEmulator,
  createUserWithEmailAndPassword
} from 'firebase/auth';

// Configuración para el emulador
const firebaseConfig = {
  apiKey: "demo-api-key",
  authDomain: "demo-project.firebaseapp.com",
  projectId: "demo-app-tdah",
  storageBucket: "demo-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "demo-app-id"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Conectar a emuladores
connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
connectFirestoreEmulator(db, 'localhost', 8080);

async function cargarDatosEjemplo() {
  try {
    console.log('🔄 Creando usuario de prueba...');
    
    // Crear usuario de prueba
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      'test@example.com',
      'password123'
    );
    const userId = userCredential.user.uid;
    
    console.log('✅ Usuario creado:', userCredential.user.email);
    
    // Crear perfil de usuario
    await setDoc(doc(db, 'usuarios', userId), {
      displayName: 'Usuario de Prueba',
      email: 'test@example.com',
      createdAt: new Date().toISOString(),
      preferences: {
        notifications: true,
        theme: 'light'
      }
    });
    
    console.log('📝 Agregando tareas de ejemplo...');
    
    // Agregar tareas de ejemplo
    const tareas = [
      {
        texto: 'Revisar correo electrónico',
        categoria: 'trabajo',
        prioridad: 'alta',
        completada: false,
        userId,
        fecha: new Date().toISOString(),
        createdAt: new Date().toISOString()
      },
      {
        texto: 'Hacer ejercicio 30 minutos',
        categoria: 'salud',
        prioridad: 'media',
        completada: true,
        userId,
        fecha: new Date().toISOString(),
        createdAt: new Date().toISOString()
      },
      {
        texto: 'Leer capítulo del libro',
        categoria: 'personal',
        prioridad: 'baja',
        completada: false,
        userId,
        fecha: new Date().toISOString(),
        createdAt: new Date().toISOString()
      },
      {
        texto: 'Preparar presentación',
        categoria: 'trabajo',
        prioridad: 'alta',
        completada: false,
        userId,
        fecha: new Date().toISOString(),
        createdAt: new Date().toISOString()
      },
      {
        texto: 'Meditar 10 minutos',
        categoria: 'salud',
        prioridad: 'media',
        completada: true,
        userId,
        fecha: new Date().toISOString(),
        createdAt: new Date().toISOString()
      }
    ];
    
    for (const tarea of tareas) {
      await addDoc(collection(db, 'tareas'), tarea);
    }
    
    console.log('📔 Agregando entradas de diario...');
    
    // Agregar entradas de diario de ejemplo
    const diarios = [
      {
        fecha: new Date().toISOString().split('T')[0],
        positivo: 'Logré completar mi rutina de ejercicio y me sentí con mucha energía.',
        mejorar: 'Podría organizar mejor mi tiempo para no sentirme apresurado.',
        emocion: 'feliz',
        energia: 7,
        userId,
        createdAt: new Date().toISOString()
      },
      {
        fecha: new Date(Date.now() - 86400000).toISOString().split('T')[0], // Ayer
        positivo: 'Tuve una conversación muy productiva con mi equipo.',
        mejorar: 'Necesito recordar tomar más pausas durante el día.',
        emocion: 'neutral',
        energia: 5,
        userId,
        createdAt: new Date(Date.now() - 86400000).toISOString()
      },
      {
        fecha: new Date(Date.now() - 172800000).toISOString().split('T')[0], // Hace 2 días
        positivo: 'Terminé el proyecto antes de la fecha límite.',
        mejorar: 'Debo evitar procrastinar al inicio del día.',
        emocion: 'muy_feliz',
        energia: 8,
        userId,
        createdAt: new Date(Date.now() - 172800000).toISOString()
      }
    ];
    
    for (const entrada of diarios) {
      await addDoc(collection(db, 'diarios'), entrada);
    }
    
    console.log('✅ Datos de ejemplo cargados exitosamente!');
    console.log('');
    console.log('📧 Usuario de prueba:');
    console.log('   Email: test@example.com');
    console.log('   Contraseña: password123');
    console.log('');
    console.log('🎉 ¡El emulador está listo para usar!');
    
  } catch (error) {
    console.error('❌ Error cargando datos:', error);
  }
  
  process.exit(0);
}

// Ejecutar
cargarDatosEjemplo();

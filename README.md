# 📱 App de Apoyo para TDAH - Firebase + React

Una aplicación web progresiva (PWA) para personas con TDAH que incluye planeador del día, diario de reflexión y tips de bienestar. Desarrollada con React y Firebase para sincronización en tiempo real.

## 🎯 Características

- **Planeador del Día**: Organiza tareas con prioridades y categorías
- **Diario de Reflexión**: Registro diario de emociones y reflexiones
- **Tips de Bienestar**: Consejos y estrategias para el manejo del TDAH
- **Sincronización en tiempo real** entre dispositivos
- **Funciona offline** y sincroniza al conectarse
- **Autenticación segura** con email/contraseña o Google
- **PWA**: Instalable en móviles como app nativa

## 🚀 Instalación Paso a Paso

### Prerrequisitos
- Node.js (versión 16 o superior)
- npm o yarn
- Cuenta de Google para Firebase

### 1️⃣ Clonar y preparar el proyecto

```bash
# Crear carpeta del proyecto
mkdir app-tdah
cd app-tdah

# Copiar todos los archivos que te he proporcionado
# O inicializar con git si tienes un repositorio

# Instalar dependencias
npm install
```

### 2️⃣ Configurar Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Crea un nuevo proyecto llamado "app-tdah"
3. En la consola de Firebase:

#### Habilitar Authentication:
- Ve a Authentication > Sign-in method
- Habilita "Email/Password"
- Habilita "Google" (opcional)

#### Crear Firestore Database:
- Ve a Firestore Database
- Crea una base de datos
- Elige "Start in test mode" (cambiarás esto después)
- Selecciona la ubicación más cercana

#### Obtener credenciales:
- Ve a Project Settings (⚙️)
- En "Your apps", click en "</>" (Web)
- Registra tu app con el nombre "app-tdah"
- Copia la configuración de Firebase

### 3️⃣ Configurar credenciales en tu proyecto

Edita `src/config/firebase.js` y reemplaza con tus credenciales:

```javascript
const firebaseConfig = {
  apiKey: "tu-api-key-aqui",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "tu-sender-id",
  appId: "tu-app-id"
};
```

### 4️⃣ Configurar reglas de seguridad en Firestore

En Firebase Console > Firestore > Rules, pega estas reglas:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuarios solo pueden leer/escribir sus propios datos
    match /usuarios/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Tareas: solo el dueño puede acceder
    match /tareas/{document=**} {
      allow read, write: if request.auth != null 
        && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null 
        && request.auth.uid == request.resource.data.userId;
    }
    
    // Diarios: solo el dueño puede acceder
    match /diarios/{document=**} {
      allow read, write: if request.auth != null 
        && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null 
        && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

### 5️⃣ Iniciar desarrollo local

```bash
# Iniciar servidor de desarrollo
npm run dev

# La app estará disponible en http://localhost:5173
```

## 📱 Convertir a App Móvil

### Opción A: PWA (Recomendado para empezar)

La app ya está configurada como PWA. Los usuarios pueden:
1. Abrir la app en el navegador móvil
2. Click en "Agregar a pantalla de inicio"
3. La app funcionará como nativa

### Opción B: App Nativa con Capacitor

```bash
# Instalar Capacitor
npm install @capacitor/core @capacitor/cli
npx cap init

# Agregar plataformas
npx cap add android
npx cap add ios

# Construir proyecto
npm run build

# Sincronizar con Capacitor
npx cap sync

# Abrir en Android Studio
npx cap open android

# Abrir en Xcode (solo Mac)
npx cap open ios
```

## 🚀 Despliegue

### Opción 1: Firebase Hosting (Gratis)

```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Inicializar hosting
firebase init hosting

# Seleccionar:
# - Existing project: app-tdah
# - Public directory: dist
# - Single-page app: Yes
# - GitHub Actions: No (por ahora)

# Construir proyecto
npm run build

# Desplegar
firebase deploy
```

Tu app estará en: `https://app-tdah.web.app`

### Opción 2: Integrar con WordPress

1. Construye el proyecto: `npm run build`
2. Copia el contenido de `dist/` a tu servidor WordPress
3. Crea una página en WordPress con el iframe o embebe directamente

## 🔧 Scripts disponibles

```bash
npm run dev        # Desarrollo local
npm run build      # Construir para producción
npm run preview    # Preview de producción
```

## 📂 Estructura del proyecto

```
app-tdah/
├── src/
│   ├── components/        # Componentes React
│   │   ├── PlaneadorDia.jsx
│   │   ├── DiarioReflexion.jsx
│   │   ├── TipsBienestar.jsx
│   │   ├── Login.jsx
│   │   └── ...
│   ├── hooks/            # Hooks personalizados
│   │   ├── useAuth.js
│   │   └── useFirebaseSync.js
│   ├── config/           # Configuración
│   │   └── firebase.js
│   ├── App.jsx           # Componente principal
│   └── main.jsx          # Punto de entrada
├── public/               # Archivos estáticos
├── package.json          # Dependencias
└── vite.config.js        # Configuración Vite
```

## 🛠️ Personalización

### Cambiar colores y tema
Edita `src/App.css` para personalizar:
- Colores principales
- Tipografías
- Espaciados
- Animaciones

### Agregar nuevas funciones
1. Crea un nuevo componente en `src/components/`
2. Agrega la ruta en `src/App.jsx`
3. Usa `useFirebaseSync` para sincronización

## 🐛 Solución de problemas

### Error: "Firebase: No Firebase App"
- Verifica que las credenciales en `firebase.js` sean correctas
- Asegúrate de haber creado el proyecto en Firebase Console

### Error: "Permission denied"
- Revisa las reglas de seguridad en Firestore
- Verifica que el usuario esté autenticado

### La app no funciona offline
- Verifica que el service worker esté registrado
- Revisa la consola del navegador para errores

## 📚 Recursos útiles

- [Documentación de React](https://react.dev)
- [Documentación de Firebase](https://firebase.google.com/docs)
- [Guía de PWA](https://web.dev/progressive-web-apps/)
- [Capacitor Docs](https://capacitorjs.com/docs)

## 🤝 Soporte

Si tienes problemas o preguntas:
1. Revisa esta documentación
2. Busca en los issues del proyecto
3. Contacta para soporte adicional

## 📄 Licencia

Este proyecto está bajo licencia MIT. Puedes usarlo y modificarlo libremente.

---

**Desarrollado con ❤️ para la comunidad TDAH**

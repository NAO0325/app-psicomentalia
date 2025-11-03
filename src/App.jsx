// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Login from './components/Login';
import Registro from './components/Registro';
import Dashboard from './components/Dashboard';
import PlaneadorDia from './components/PlaneadorDia';
import DiarioReflexion from './components/DiarioReflexion';
import TipsBienestar from './components/TipsBienestar';
import Perfil from './components/Perfil';
import Navigation from './components/Navigation';
import './App.css';
import './animations.css'; // ← Importar las animaciones

// Componente para rutas protegidas
const RutaProtegida = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner-large"></div>
        <p>Cargando aplicación...</p>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/login" replace />;
};

// Componente para rutas públicas (como login/registro)
const RutaPublica = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner-large"></div>
        <p>Cargando...</p>
      </div>
    );
  }
  
  return user ? <Navigate to="/" replace /> : children;
};

// Layout principal con navegación
const Layout = ({ children }) => {
  return (
    <div className="app-layout">
      <Navigation />
      <main className="app-content">
        {children}
      </main>
    </div>
  );
};

// Componente de transición entre páginas
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <TransitionGroup component={null}>
      <CSSTransition
        key={location.pathname}
        classNames="page"
        timeout={500}
        unmountOnExit
      >
        <Routes location={location}>
          {/* Rutas públicas */}
          <Route
            path="/login"
            element={
              <RutaPublica>
                <div className="page-wrapper">
                  <Login />
                </div>
              </RutaPublica>
            }
          />
          <Route
            path="/registro"
            element={
              <RutaPublica>
                <div className="page-wrapper">
                  <Registro />
                </div>
              </RutaPublica>
            }
          />
          
          {/* Rutas protegidas */}
          <Route
            path="/"
            element={
              <RutaProtegida>
                <Layout>
                  <div className="page-wrapper">
                    <Dashboard />
                  </div>
                </Layout>
              </RutaProtegida>
            }
          />
          <Route
            path="/planeador"
            element={
              <RutaProtegida>
                <Layout>
                  <div className="page-wrapper">
                    <PlaneadorDia />
                  </div>
                </Layout>
              </RutaProtegida>
            }
          />
          <Route
            path="/diario"
            element={
              <RutaProtegida>
                <Layout>
                  <div className="page-wrapper">
                    <DiarioReflexion />
                  </div>
                </Layout>
              </RutaProtegida>
            }
          />
          <Route
            path="/tips"
            element={
              <RutaProtegida>
                <Layout>
                  <div className="page-wrapper">
                    <TipsBienestar />
                  </div>
                </Layout>
              </RutaProtegida>
            }
          />
          <Route
            path="/perfil"
            element={
              <RutaProtegida>
                <Layout>
                  <div className="page-wrapper">
                    <Perfil />
                  </div>
                </Layout>
              </RutaProtegida>
            }
          />
          
          {/* Ruta por defecto */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </CSSTransition>
    </TransitionGroup>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <AnimatedRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

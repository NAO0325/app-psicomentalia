// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
  
  return user ? children : <Navigate to="/login" />;
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

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Routes>
            {/* Rutas públicas */}
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            
            {/* Rutas protegidas */}
            <Route
              path="/"
              element={
                <RutaProtegida>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </RutaProtegida>
              }
            />
            <Route
              path="/planeador"
              element={
                <RutaProtegida>
                  <Layout>
                    <PlaneadorDia />
                  </Layout>
                </RutaProtegida>
              }
            />
            <Route
              path="/diario"
              element={
                <RutaProtegida>
                  <Layout>
                    <DiarioReflexion />
                  </Layout>
                </RutaProtegida>
              }
            />
            <Route
              path="/tips"
              element={
                <RutaProtegida>
                  <Layout>
                    <TipsBienestar />
                  </Layout>
                </RutaProtegida>
              }
            />
            <Route
              path="/perfil"
              element={
                <RutaProtegida>
                  <Layout>
                    <Perfil />
                  </Layout>
                </RutaProtegida>
              }
            />
            
            {/* Ruta por defecto */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

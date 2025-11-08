// Contenedor de PlaneadorDia: gestiona estado/efectos y delega render a View
import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { db } from '../../config/firebase';
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  orderBy
} from 'firebase/firestore';
import View from './View.jsx';

function getFechaActual(now = new Date()) {
  return now.toLocaleDateString('es-ES', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
}
function getDiaDelMes(now = new Date()) { return now.getDate(); }

export default function PlaneadorDia() {
  const { user } = useAuth();
  const [tareas, setTareas] = useState([]);
  const [nuevaTarea, setNuevaTarea] = useState('');
  const [loading, setLoading] = useState(true);
  const [agregando, setAgregando] = useState(false);

  const fechaActual = useMemo(() => getFechaActual(), []);
  const diaDelMes = useMemo(() => getDiaDelMes(), []);

  useEffect(() => { if (user) cargarTareas(); }, [user]);

  async function cargarTareas() {
    try {
      setLoading(true);
      const fechaHoy = new Date().toISOString().split('T')[0];
      const q = query(
        collection(db, 'tareas'),
        where('userId', '==', user.uid),
        where('fecha', '==', fechaHoy),
        orderBy('createdAt', 'desc')
      );
      const snap = await getDocs(q);
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setTareas(items);
    } catch (e) {
      console.error('Error al cargar tareas:', e);
    } finally { setLoading(false); }
  }

  async function agregarTarea(e) {
    e.preventDefault();
    if (!nuevaTarea.trim()) return;
    try {
      setAgregando(true);
      const fechaHoy = new Date().toISOString().split('T')[0];
      const nueva = {
        userId: user.uid,
        titulo: nuevaTarea,
        completada: false,
        fecha: fechaHoy,
        createdAt: new Date().toISOString()
      };
      const ref = await addDoc(collection(db, 'tareas'), nueva);
      setTareas(prev => [{ id: ref.id, ...nueva }, ...prev]);
      setNuevaTarea('');
    } catch (e) {
      console.error('Error al agregar tarea:', e);
    } finally { setAgregando(false); }
  }

  async function toggleTarea(tareaId, completada) {
    try {
      const r = doc(db, 'tareas', tareaId);
      await updateDoc(r, { completada: !completada });
      setTareas(prev => prev.map(t => t.id === tareaId ? { ...t, completada: !completada } : t));
    } catch (e) { console.error('Error al actualizar tarea:', e); }
  }

  async function eliminarTarea(tareaId) {
    if (!window.confirm('¿Estás seguro de eliminar esta tarea?')) return;
    try {
      await deleteDoc(doc(db, 'tareas', tareaId));
      setTareas(prev => prev.filter(t => t.id !== tareaId));
    } catch (e) { console.error('Error al eliminar tarea:', e); }
  }

  const tareasCompletadas = tareas.filter(t => t.completada).length;
  const tareasPendientes = tareas.length - tareasCompletadas;
  const progresoDelDia = tareas.length > 0 ? Math.round((tareasCompletadas / tareas.length) * 100) : 0;

  return (
    <View
      fechaActual={fechaActual}
      diaDelMes={diaDelMes}
      progresoDelDia={progresoDelDia}
      loading={loading}
      tareas={tareas}
      tareasCompletadas={tareasCompletadas}
      tareasPendientes={tareasPendientes}
      nuevaTarea={nuevaTarea}
      onNuevaTareaChange={setNuevaTarea}
      onAgregarTarea={agregarTarea}
      onToggleTarea={toggleTarea}
      onEliminarTarea={eliminarTarea}
      agregando={agregando}
    />
  );
}

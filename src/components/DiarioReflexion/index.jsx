// Contenedor de DiarioReflexion: gestiona estado, sincronización y handlers
import React, { useEffect, useMemo, useState } from 'react';
import { useFirebaseSync } from '../../hooks/useFirebaseSync';
import View from './View.jsx';
import '../../styles/diario-visual.css';

export default function DiarioReflexion() {
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [positivo, setPositivo] = useState('');
  const [mejorar, setMejorar] = useState('');
  const [emocion, setEmocion] = useState('neutral');
  const [energia, setEnergia] = useState(5);
  const [editando, setEditando] = useState(null);
  const [vistaHistorial, setVistaHistorial] = useState(false);

  const { data: entradas, loading, addDocument, updateDocument, deleteDocument } = useFirebaseSync('diarios', []);

  useEffect(() => {
    const entradaHoy = entradas.find(e => new Date(e.fecha).toDateString() === new Date(fecha).toDateString());
    if (entradaHoy && !editando) {
      setPositivo(entradaHoy.positivo);
      setMejorar(entradaHoy.mejorar);
      setEmocion(entradaHoy.emocion || 'neutral');
      setEnergia(entradaHoy.energia || 5);
      setEditando(entradaHoy.id);
    } else if (!entradaHoy && !editando) {
      limpiarFormulario();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fecha, entradas]);

  function limpiarFormulario() {
    setPositivo('');
    setMejorar('');
    setEmocion('neutral');
    setEnergia(5);
    setEditando(null);
  }

  function calcularEstadoAnimo() {
    const emociones = { 'muy_feliz': 5, 'feliz': 4, 'neutral': 3, 'triste': 2, 'muy_triste': 1 };
    return (emociones[emocion] + energia) / 2;
  }

  async function handleGuardar(e) {
    e.preventDefault();
    if (!positivo.trim() && !mejorar.trim()) { alert('Por favor, escribe al menos una reflexión'); return; }
    const entrada = { fecha, positivo, mejorar, emocion, energia, estadoAnimo: calcularEstadoAnimo() };
    if (editando) await updateDocument(editando, entrada); else await addDocument(entrada);
    alert('✨ Reflexión guardada con éxito');
  }

  async function handleEliminar(id) {
    if (!window.confirm('¿Estás seguro de eliminar esta reflexión?')) return;
    await deleteDocument(id);
    limpiarFormulario();
  }

  const stats = useMemo(() => {
    if (entradas.length === 0) return null;
    const ultimaSemana = entradas.slice(0, 7);
    const promedioEnergia = ultimaSemana.reduce((acc, e) => acc + (e.energia || 5), 0) / ultimaSemana.length;
    // calcular días consecutivos
    let consecutivos = 1;
    const fechasOrdenadas = entradas.map(e => new Date(e.fecha)).sort((a, b) => b - a);
    for (let i = 0; i < fechasOrdenadas.length - 1; i++) {
      const diff = (fechasOrdenadas[i] - fechasOrdenadas[i + 1]) / (1000 * 60 * 60 * 24);
      if (diff === 1) consecutivos++; else break;
    }
    return { total: entradas.length, ultimaSemana: ultimaSemana.length, promedioEnergia: Number(promedioEnergia.toFixed(1)), diasConsecutivos: consecutivos };
  }, [entradas]);

  const emojis = { 'muy_feliz': '😄', 'feliz': '😊', 'neutral': '😐', 'triste': '😔', 'muy_triste': '😢' };

  return (
    <View
      loading={loading}
      fecha={fecha}
      setFecha={setFecha}
      positivo={positivo}
      setPositivo={setPositivo}
      mejorar={mejorar}
      setMejorar={setMejorar}
      emocion={emocion}
      setEmocion={setEmocion}
      energia={energia}
      setEnergia={setEnergia}
      editando={editando}
      setEditando={setEditando}
      vistaHistorial={vistaHistorial}
      setVistaHistorial={setVistaHistorial}
      onGuardar={handleGuardar}
      onEliminar={handleEliminar}
      limpiarFormulario={limpiarFormulario}
      stats={stats}
      emojis={emojis}
      entradas={entradas}
    />
  );
}

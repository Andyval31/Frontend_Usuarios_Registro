import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '' });

  const fetchUsuarios = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/usuarios/');
      setUsuarios(res.data);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/usuarios/crear/', form);
      setForm({ nombre: '', email: '', telefono: '' });
      fetchUsuarios();
    } catch (error) {
      console.error('Error al crear usuario:', error);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Registro de Usuarios</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Nombre" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} />
        <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        <input type="text" placeholder="Teléfono" value={form.telefono} onChange={e => setForm({ ...form, telefono: e.target.value })} />
        <button type="submit">Registrar</button>
      </form>

      <h2>Usuarios Registrados</h2>
      <ul>
        {usuarios.map(u => (
          <li key={u.id}>{u.nombre} - {u.email} - {u.telefono}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
"use client";

import { useEffect, useState } from "react";

export default function Clientes() {
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    fetch("/api/Clientes")
      .then(res => res.json())
      .then(setClientes);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    await fetch("/api/Clientes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nombre: form.nombre.value,
        email: form.email.value,
        telefono: form.telefono.value,
      }),
    });

    form.reset();
    setClientes(await (await fetch("/api/Clientes")).json());
  };

  // --- ESTILOS VISUALES ---
  const gridContainerStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "1.5rem",
    marginTop: "2rem"
  };

  const cardStyle = {
    backgroundColor: "#1e1e1e",
    border: "1px solid #333",
    borderRadius: "12px",
    padding: "1.5rem",
    boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
    transition: "transform 0.2s",
  };

  const labelStyle = {
    fontSize: "0.8rem",
    color: "#888",
    display: "block",
    marginBottom: "0.2rem",
    textTransform: "uppercase",
    letterSpacing: "0.05rem"
  };

  const inputStyle = {
    padding: "0.6rem",
    borderRadius: "6px",
    border: "1px solid #444",
    backgroundColor: "#2a2a2a",
    color: "#fff",
    marginRight: "0.5rem",
    marginBottom: "0.5rem"
  };

  return (
    <div style={{ padding: "2rem", color: "#fff", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1.5rem" }}>Nuestros Vehículos</h1>

      {/* Formulario mantenido igual, solo con toques de estilo */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "3rem", padding: "1.5rem", backgroundColor: "#1e1e1e", borderRadius: "10px" }}>
        <h3 style={{ marginTop: 0 }}>Registrar Nuevo</h3>
        <input name="nombre" placeholder="Marca / Modelo" required style={inputStyle} />
        <input name="email" placeholder="Email Contacto" required style={inputStyle} />
        <input name="telefono" placeholder="Teléfono" required style={inputStyle} />
        <button type="submit" style={{ 
          padding: "0.6rem 1.5rem", 
          borderRadius: "6px", 
          backgroundColor: "#0070f3", 
          color: "#fff", 
          border: "none", 
          cursor: "pointer",
          fontWeight: "bold" 
        }}>
          Añadir
        </button>
      </form>

      {/* Grid de Tarjetas en lugar de Tabla */}
      <div style={gridContainerStyle}>
        {clientes.map(c => (
          <div key={c.id} style={cardStyle} className="vehicle-card">
            <div style={{ marginBottom: "1rem" }}>
              <span style={labelStyle}>Vehículo</span>
              <strong style={{ fontSize: "1.2rem", color: "#60a5fa" }}>{c.nombre}</strong>
            </div>
            
            <div style={{ marginBottom: "0.8rem" }}>
              <span style={labelStyle}>Contacto</span>
              <div style={{ fontSize: "0.95rem" }}>{c.email}</div>
            </div>

            <div>
              <span style={labelStyle}>Teléfono</span>
              <div style={{ fontSize: "0.95rem" }}>{c.telefono}</div>
            </div>

            <div style={{ marginTop: "1rem", fontSize: "0.7rem", color: "#444", textAlign: "right" }}>
              ID: {c.id}
            </div>
          </div>
        ))}
      </div>

      {clientes.length === 0 && (
        <p style={{ textAlign: "center", color: "#666" }}>No hay vehículos disponibles en este momento.</p>
      )}
    </div>
  );
}
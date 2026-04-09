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
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "1.5rem",
    marginTop: "2rem"
  };

  const cardStyle = {
    backgroundColor: "#1a1a1a",
    border: "1px solid #333",
    borderRadius: "12px",
    padding: "1.5rem",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    boxShadow: "0 4px 12px rgba(0,0,0,0.5)"
  };

  const badgeStyle = (isPending) => ({
    backgroundColor: isPending ? "#422c00" : "#064e3b",
    color: isPending ? "#fbbf24" : "#34d399",
    padding: "0.25rem 0.6rem",
    borderRadius: "4px",
    fontSize: "0.75rem",
    fontWeight: "bold",
    textTransform: "uppercase"
  });

  return (
    <div style={{ padding: "2rem", color: "#eee", fontFamily: "sans-serif" }}>
      <header style={{ marginBottom: "2.5rem" }}>
        <h1 style={{ fontSize: "2.2rem", color: "#fff", marginBottom: "0.5rem" }}>Gestión de Clientes</h1>
        <p style={{ color: "#888" }}>Panel de fidelización y seguimiento de trámites</p>
      </header>

      {/* Formulario de Registro */}
      <form onSubmit={handleSubmit} style={{ 
        marginBottom: "3rem", 
        padding: "1.5rem", 
        backgroundColor: "#222", 
        borderRadius: "10px",
        display: "flex",
        gap: "1rem",
        flexWrap: "wrap",
        alignItems: "center"
      }}>
        <input name="nombre" placeholder="Nombre completo" required style={{ flex: 1, padding: "0.7rem", borderRadius: "5px", border: "1px solid #444", backgroundColor: "#111", color: "#fff" }}/>
        <input name="email" placeholder="Correo electrónico" required style={{ flex: 1, padding: "0.7rem", borderRadius: "5px", border: "1px solid #444", backgroundColor: "#111", color: "#fff" }}/>
        <input name="telefono" placeholder="Teléfono" required style={{ flex: 1, padding: "0.7rem", borderRadius: "5px", border: "1px solid #444", backgroundColor: "#111", color: "#fff" }}/>
        <button type="submit" style={{ padding: "0.7rem 2rem", backgroundColor: "#3b82f6", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}>
          Registrar
        </button>
      </form>

      {/* Grid de Clientes */}
      <div style={gridContainerStyle}>
        {clientes.map(c => (
          <div key={c.id} style={cardStyle}>
            {/* Cabecera: Nombre e ID */}
            <div style={{ borderBottom: "1px solid #333", paddingBottom: "0.8rem", display: "flex", justifyContent: "space-between", alignItems: "start" }}>
              <div>
                <h3 style={{ margin: 0, color: "#fff", fontSize: "1.2rem" }}>{c.nombre}</h3>
                <span style={{ fontSize: "0.8rem", color: "#666" }}>ID: {c.id}</span>
              </div>
              {/* Badge de Trámite: Aquí asumo que tu objeto 'c' podría tener 'tramiteActivo' */}
              <span style={badgeStyle(c.tramiteActivo)}>
                {c.tramiteActivo ? "Trámite en curso" : "Sin trámites"}
              </span>
            </div>

            {/* Datos de Contacto */}
            <div style={{ fontSize: "0.9rem" }}>
              <div style={{ marginBottom: "0.4rem" }}>📧 {c.email}</div>
              <div>📞 {c.telefono}</div>
            </div>

            {/* Sección de "Me Gusta" */}
            <div style={{ marginTop: "0.5rem" }}>
              <span style={{ fontSize: "0.75rem", color: "#888", display: "block", marginBottom: "0.5rem", textTransform: "uppercase" }}>
                Vehículos Favoritos
              </span>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {/* Asumo que 'c.likes' es un array de strings o modelos */}
                {c.likes && c.likes.length > 0 ? (
                  c.likes.map((car, idx) => (
                    <span key={idx} style={{ backgroundColor: "#333", padding: "0.3rem 0.6rem", borderRadius: "15px", fontSize: "0.8rem" }}>
                      🚗 {car}
                    </span>
                  ))
                ) : (
                  <span style={{ fontSize: "0.85rem", color: "#555", fontStyle: "italic" }}>No hay favoritos guardados</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";

export default function PerfilCliente() {
  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Aquí cargaríamos los datos del cliente logueado
    fetch("/api/Clientes/mi-perfil") // Asumiendo un endpoint de sesión o perfil
      .then(res => res.json())
      .then(data => {
        setCliente(data);
        setLoading(false);
      });
  }, []);

  // --- ESTILOS ---
  const headerStyle = {
    display: "flex",
    alignItems: "center",
    padding: "1rem 2rem",
    backgroundColor: "#111",
    borderBottom: "1px solid #333",
    position: "sticky",
    top: 0,
    zIndex: 100
  };

  const backButtonStyle = {
    backgroundColor: "transparent",
    color: "#3b82f6",
    border: "1px solid #3b82f6",
    padding: "0.5rem 1rem",
    borderRadius: "20px",
    cursor: "pointer",
    marginRight: "1.5rem",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem"
  };

  const sectionStyle = {
    backgroundColor: "#1a1a1a",
    borderRadius: "15px",
    padding: "2rem",
    marginBottom: "2rem",
    border: "1px solid #222"
  };

  const carCardStyle = {
    backgroundColor: "#222",
    borderRadius: "10px",
    padding: "1rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    border: "1px solid #333"
  };

  if (loading) return <div style={{ color: "#fff", padding: "2rem" }}>Cargando tu perfil...</div>;

  return (
    <div style={{ backgroundColor: "#000", minHeight: "100vh", color: "#fff", fontFamily: "sans-serif" }}>
      
      {/* Encabezado con Navegación */}
      <header style={headerStyle}>
        <button onClick={() => window.history.back()} style={backButtonStyle}>
          ← Volver al Catálogo
        </button>
        <h2 style={{ fontSize: "1.2rem", margin: 0 }}>Mi Cuenta</h2>
      </header>

      <main style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem" }}>
        
        {/* Sección 1: Datos Personales */}
        <section style={sectionStyle}>
          <h3 style={{ marginTop: 0, color: "#3b82f6" }}>Mis Datos</h3>
          <div className="iauto-profile-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={{ fontSize: "0.8rem", color: "#666" }}>NOMBRE</label>
              <p style={{ margin: "0.2rem 0" }}>{cliente?.nombre}</p>
            </div>
            <div>
              <label style={{ fontSize: "0.8rem", color: "#666" }}>EMAIL</label>
              <p style={{ margin: "0.2rem 0" }}>{cliente?.email}</p>
            </div>
          </div>
        </section>

        {/* Sección 2: Estado de Compras / Trámites */}
        <section style={sectionStyle}>
          <h3 style={{ marginTop: 0, color: "#10b981" }}>Mis Trámites</h3>
          {cliente?.tramiteActivo ? (
            <div style={{ backgroundColor: "#064e3b", padding: "1rem", borderRadius: "8px", border: "1px solid #059669" }}>
              <strong style={{ display: "block" }}>¡Tienes una compra en curso!</strong>
              <span style={{ fontSize: "0.9rem" }}>Nuestro equipo está revisando la documentación de tu próximo vehículo.</span>
            </div>
          ) : (
            <p style={{ color: "#666" }}>No tienes trámites de compra activos actualmente.</p>
          )}
        </section>

        {/* Sección 3: Mis "Me Gusta" (Grid de Coches Favoritos) */}
        <section style={sectionStyle}>
          <h3 style={{ marginTop: 0, color: "#ef4444" }}>Coches Favoritos</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {cliente?.likes?.length > 0 ? (
              cliente.likes.map((carId, index) => (
                <div key={index} className="iauto-profile-item" style={carCardStyle}>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <span style={{ fontSize: "1.5rem" }}>🚗</span>
                    <span>{carId}</span> {/* Aquí iría el nombre del modelo */}
                  </div>
                  <button 
                    style={{ background: "transparent", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "1.2rem" }}
                    title="Quitar de favoritos"
                  >
                    ❤️
                  </button>
                </div>
              ))
            ) : (
              <p style={{ color: "#666" }}>Aún no has guardado ningún coche en favoritos.</p>
            )}
          </div>
        </section>

      </main>
    </div>
  );
}

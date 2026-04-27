"use client";
import { useEffect, useState } from "react";

export default function Perfil() {
  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const rol = localStorage.getItem("userRol");
    if (!userId) { window.location.href = "/login"; return; }
    if (rol === "admin") { window.location.href = "/Empleados"; return; }

    fetch("/api/Clientes").then(r => r.json()).then(data => {
      const user = data.find(c => c.id === parseInt(userId));
      setCliente(user);
      setLoading(false);
    });
  }, []);

  const handleLogout = () => { localStorage.clear(); window.location.href = "/"; };

  if (loading) return (
    <div style={{ backgroundColor: "#000", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", color: "#fff" }}>
      Cargando...
    </div>
  );

  return (
    <div style={{ backgroundColor: "#050505", minHeight: "100vh", color: "#fff", fontFamily: "sans-serif" }}>

      <header style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "1rem 3rem", backgroundColor: "#0d0d0d", borderBottom: "1px solid #1a1a1a",
        position: "sticky", top: 0, zIndex: 100
      }}>
        <span onClick={() => window.location.href = "/"} style={{ fontSize: "1.4rem", fontWeight: "800", color: "#3b82f6", cursor: "pointer", letterSpacing: "2px" }}>IAUTO</span>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button onClick={() => window.location.href = "/Vehiculos"} style={{ background: "none", border: "1px solid #222", color: "#aaa", padding: "6px 16px", borderRadius: "20px", cursor: "pointer", fontSize: "0.85rem" }}>
            Ver Vehículos
          </button>
          <button onClick={handleLogout} style={{ background: "none", border: "1px solid #ef4444", color: "#ef4444", padding: "6px 16px", borderRadius: "20px", cursor: "pointer", fontSize: "0.85rem" }}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <main style={{ maxWidth: "800px", margin: "3rem auto", padding: "0 2rem" }}>
        {/* Avatar + nombre */}
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "3rem" }}>
          <div style={{
            width: "70px", height: "70px", borderRadius: "50%",
            backgroundColor: "#1a1a2e", display: "flex", justifyContent: "center",
            alignItems: "center", fontSize: "2rem", border: "2px solid #3b82f6"
          }}>
            {cliente?.nombre?.[0]?.toUpperCase()}
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: "1.6rem" }}>Hola, {cliente?.nombre} 👋</h1>
            <p style={{ color: "#555", margin: "0.2rem 0 0", fontSize: "0.9rem" }}>Cliente IAuto</p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
          <section style={{ backgroundColor: "#0d0d0d", padding: "1.8rem", borderRadius: "16px", border: "1px solid #1a1a1a" }}>
            <h3 style={{ color: "#3b82f6", marginTop: 0, fontSize: "1rem" }}>📋 Mis Datos</h3>
            <div style={{ marginBottom: "1rem" }}>
              <p style={{ color: "#555", fontSize: "0.75rem", textTransform: "uppercase", marginBottom: "0.2rem" }}>Email</p>
              <p style={{ margin: 0 }}>{cliente?.email}</p>
            </div>
            <div>
              <p style={{ color: "#555", fontSize: "0.75rem", textTransform: "uppercase", marginBottom: "0.2rem" }}>Teléfono</p>
              <p style={{ margin: 0 }}>{cliente?.telefono}</p>
            </div>
          </section>

          <section style={{ backgroundColor: "#0d0d0d", padding: "1.8rem", borderRadius: "16px", border: "1px solid #1a1a1a" }}>
            <h3 style={{ color: "#ef4444", marginTop: 0, fontSize: "1rem" }}>❤️ Favoritos</h3>
            <p style={{ color: "#444", fontSize: "0.9rem", lineHeight: "1.6" }}>
              Próximamente verás aquí tus coches guardados y el estado de tus compras.
            </p>
          </section>
        </div>

        <div style={{ marginTop: "1.5rem", backgroundColor: "#0d0d0d", padding: "1.8rem", borderRadius: "16px", border: "1px solid #1a1a1a" }}>
          <h3 style={{ color: "#10b981", marginTop: 0, fontSize: "1rem" }}>🛒 Mis Trámites</h3>
          <p style={{ color: "#444", fontSize: "0.9rem" }}>No tienes trámites de compra activos actualmente.</p>
          <button
            onClick={() => window.location.href = "/Vehiculos"}
            style={{ marginTop: "0.5rem", padding: "10px 22px", backgroundColor: "#3b82f6", color: "#fff", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "600" }}
          >
            Explorar Vehículos →
          </button>
        </div>
      </main>
    </div>
  );
}
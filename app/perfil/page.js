"use client";
import { useEffect, useState } from "react";

export default function Perfil() {
  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) { window.location.href = "/login"; return; }

    fetch("/api/Clientes")
      .then(res => res.json())
      .then(data => {
        const user = data.find(c => c.id === parseInt(userId));
        setCliente(user);
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ color: "#fff", padding: "2rem" }}>Cargando...</div>;

  return (
    <div style={{ backgroundColor: "#000", minHeight: "100vh", color: "#fff", padding: "2rem" }}>
      <button onClick={() => window.location.href = "/"} style={{ color: "#3b82f6", background: "none", border: "1px solid #3b82f6", padding: "5px 15px", borderRadius: "15px", cursor: "pointer" }}>← Volver</button>
      
      <main style={{ maxWidth: "800px", margin: "2rem auto" }}>
        <h1 style={{ borderBottom: "1px solid #333", paddingBottom: "1rem" }}>Hola, {cliente?.nombre}</h1>
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginTop: "2rem" }}>
          <section style={{ backgroundColor: "#111", padding: "1.5rem", borderRadius: "10px" }}>
            <h3 style={{ color: "#3b82f6" }}>Mis Datos</h3>
            <p>Email: {cliente?.email}</p>
            <p>Teléfono: {cliente?.telefono}</p>
          </section>

          <section style={{ backgroundColor: "#111", padding: "1.5rem", borderRadius: "10px" }}>
            <h3 style={{ color: "#ef4444" }}>❤️ Favoritos</h3>
            <p style={{ color: "#666" }}>Próximamente verás aquí tus coches guardados.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
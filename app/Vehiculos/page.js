"use client";
import { useEffect, useState } from "react";

export default function ListaVehiculos() {
  const [vehiculos, setVehiculos] = useState([]);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Cargar el nombre del usuario logueado
    const userId = localStorage.getItem("userId");
    if (userId) {
      fetch("/api/Clientes")
        .then(res => res.json())
        .then(data => {
          const user = data.find(c => c.id === parseInt(userId));
          if (user) setUserName(user.nombre);
        });
    }

    // 2. Cargar los vehículos de la base de datos
    fetch("/api/Vehiculos")
      .then(res => res.json())
      .then(data => {
        setVehiculos(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error cargando vehículos:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ backgroundColor: "#000", color: "#fff", minHeight: "100vh", fontFamily: "sans-serif" }}>
      {/* HEADER */}
      <header style={{ 
        display: "flex", justifyContent: "space-between", alignItems: "center", 
        padding: "1.5rem 4rem", borderBottom: "1px solid #222", backgroundColor: "#000" 
      }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#3b82f6", cursor: "pointer" }} onClick={() => window.location.href="/"}>
          IAUTO
        </h1>
        
        {userName && (
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <span style={{ color: "#aaa" }}>Bienvenido, <strong>{userName}</strong></span>
            <button 
              onClick={() => window.location.href = "/perfil"}
              style={{ 
                padding: "8px 18px", borderRadius: "20px", border: "1px solid #3b82f6", 
                background: "none", color: "#3b82f6", cursor: "pointer", fontWeight: "600" 
              }}
            >
              Ver mis trámites
            </button>
          </div>
        )}
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main style={{ padding: "3rem 4rem" }}>
        <h2 style={{ marginBottom: "2rem" }}>Catálogo de Vehículos</h2>

        {loading ? (
          <p>Cargando vehículos disponibles...</p>
        ) : vehiculos.length > 0 ? (
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", 
            gap: "2rem" 
          }}>
            {vehiculos.map((v) => (
              <div key={v.id} style={{ 
                backgroundColor: "#111", borderRadius: "15px", border: "1px solid #222", 
                overflow: "hidden", transition: "transform 0.2s" 
              }}>
                <div style={{ height: "180px", backgroundColor: "#222", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "3rem" }}>
                  🚗
                </div>
                <div style={{ padding: "1.5rem" }}>
                  <h3 style={{ margin: "0 0 0.5rem 0" }}>{v.marca} {v.modelo}</h3>
                  <p style={{ color: "#3b82f6", fontSize: "1.2rem", fontWeight: "bold", margin: "0 0 1rem 0" }}>
                    {v.precio.toLocaleString()} €
                  </p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "0.8rem", color: "#666" }}>Stock: {v.stock} uds</span>
                    <button style={{ 
                      backgroundColor: "#3b82f6", color: "#fff", border: "none", 
                      padding: "8px 15px", borderRadius: "8px", cursor: "pointer" 
                    }}>
                      Me gusta
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: "#666" }}>No hay vehículos disponibles en este momento.</p>
        )}
      </main>
    </div>
  );
}
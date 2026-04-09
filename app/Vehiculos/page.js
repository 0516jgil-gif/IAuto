"use client";
import { useEffect, useState } from "react";

export default function ListaVehiculos() {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // Recuperamos el ID del usuario logueado
    const userId = localStorage.getItem("userId");
    if (userId) {
      // Opcional: Podrías hacer un fetch rápido para sacar solo el nombre
      fetch("/api/Clientes")
        .then(res => res.json())
        .then(data => {
          const user = data.find(c => c.id === parseInt(userId));
          if (user) setUserName(user.nombre);
        });
    }
  }, []);

  return (
    <div style={{ backgroundColor: "#000", color: "#fff", minHeight: "100vh", padding: "2rem" }}>
      <header style={{ display: "flex", justifyContent: "space-between", marginBottom: "2rem" }}>
        <h1>Catálogo IAuto</h1>
        {userName && (
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span style={{ color: "#aaa" }}>Bienvenido, <strong>{userName}</strong></span>
            <button 
              onClick={() => window.location.href = "/perfil"}
              style={{ padding: "5px 15px", borderRadius: "20px", border: "1px solid #3b82f6", background: "none", color: "#3b82f6", cursor: "pointer" }}
            >
              Ver mis trámites
            </button>
          </div>
        )}
      </header>

      {/* Aquí va tu Grid de coches que hicimos al principio */}
      {/* ... */}
    </div>
  );
}
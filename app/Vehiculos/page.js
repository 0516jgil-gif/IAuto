"use client";
import { useEffect, useState } from "react";

export default function ListaVehiculos() {
  const [vehiculos, setVehiculos] = useState([]);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // FUNCIÓN DE CONTROL DE SESIÓN
    const checkSession = () => {
      const userId = localStorage.getItem("userId");
      const lastActivity = localStorage.getItem("lastActivity");
      const ahora = new Date().getTime();
      const treintaMinutos = 30 * 60 * 1000;

      if (!userId || !lastActivity || (ahora - parseInt(lastActivity) > treintaMinutos)) {
        localStorage.clear();
        window.location.href = "/login";
        return false;
      }
      // Si está activo, renovamos el tiempo para darle otros 30 min
      localStorage.setItem("lastActivity", ahora.toString());
      return userId;
    };

    const userId = checkSession();
    if (userId) {
      // Cargar datos
      fetch("/api/Clientes").then(res => res.json()).then(data => {
        const user = data.find(c => c.id === parseInt(userId));
        if (user) setUserName(user.nombre);
      });

      fetch("/api/Vehiculos").then(res => res.json()).then(setVehiculos);
    }
  }, []);

  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div style={{ backgroundColor: "#000", color: "#fff", minHeight: "100vh", fontFamily: "sans-serif" }}>
      <header style={{ display: "flex", justifyContent: "space-between", padding: "1.5rem 4rem", borderBottom: "1px solid #222" }}>
        <h1 onClick={() => window.location.href="/"}>IAUTO</h1>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span>Hola, <strong>{userName}</strong></span>
          <button onClick={() => window.location.href="/perfil"} style={{ color: "#3b82f6", background: "none", border: "1px solid #3b82f6", padding: "5px 10px", borderRadius: "15px", cursor: "pointer" }}>Perfil</button>
          <button onClick={logout} style={{ color: "#ff4444", background: "none", border: "none", cursor: "pointer" }}>Cerrar Sesión</button>
        </div>
      </header>

      <main style={{ padding: "3rem 4rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "2rem" }}>
          {vehiculos.map(v => (
            <div key={v.id} style={{ backgroundColor: "#111", padding: "1.5rem", borderRadius: "15px", border: "1px solid #222" }}>
              <h3>{v.marca} {v.modelo}</h3>
              <p style={{ color: "#3b82f6", fontWeight: "bold" }}>{v.precio} €</p>
              <button style={{ width: "100%", padding: "10px", backgroundColor: "#222", color: "#fff", border: "none", borderRadius: "5px" }}>Me gusta ❤️</button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
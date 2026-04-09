"use client";
import { useEffect, useState } from "react";

export default function ListaVehiculos() {
  const [vehiculos, setVehiculos] = useState([]);
  const [userName, setUserName] = useState("");
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    // 1. Verificamos sesión pero SIN echar al usuario si no hay
    const userId = localStorage.getItem("userId");
    const lastActivity = localStorage.getItem("lastActivity");
    const ahora = new Date().getTime();
    const treintaMinutos = 30 * 60 * 1000;

    if (userId && lastActivity && (ahora - parseInt(lastActivity) < treintaMinutos)) {
      setIsLogged(true);
      localStorage.setItem("lastActivity", ahora.toString()); // Renovamos tiempo
      
      // Cargamos el nombre solo si hay sesión
      fetch("/api/Clientes")
        .then(res => res.json())
        .then(data => {
          const user = data.find(c => c.id === parseInt(userId));
          if (user) setUserName(user.nombre);
        });
    } else {
      // Si la sesión expiró o no existe, aseguramos que esté limpio
      if (userId) localStorage.clear();
      setIsLogged(false);
    }

    // 2. Cargamos los vehículos (Esto es para todos)
    fetch("/api/Vehiculos")
      .then(res => res.json())
      .then(data => setVehiculos(data))
      .catch(err => console.error("Error:", err));
  }, []);

  // Función para las acciones restringidas
  const handleAccionRestringida = (accion) => {
    if (!isLogged) {
      alert(`Para ${accion} debes iniciar sesión.`);
      window.location.href = "/login";
    } else {
      alert(`${accion.charAt(0).toUpperCase() + accion.slice(1)} completado con éxito.`);
    }
  };

  return (
    <div style={{ backgroundColor: "#000", color: "#fff", minHeight: "100vh", fontFamily: "sans-serif" }}>
      {/* HEADER DINÁMICO */}
      <header style={{ display: "flex", justifyContent: "space-between", padding: "1.5rem 4rem", borderBottom: "1px solid #222" }}>
        <h1 onClick={() => window.location.href="/"} style={{ cursor: "pointer", color: "#3b82f6" }}>IAUTO</h1>
        
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          {isLogged ? (
            <>
              <span style={{ color: "#aaa" }}>Hola, <strong>{userName}</strong></span>
              <button onClick={() => window.location.href="/perfil"} style={{ background: "none", border: "1px solid #333", color: "#fff", padding: "5px 15px", borderRadius: "20px", cursor: "pointer" }}>Mi Perfil</button>
              <button onClick={() => { localStorage.clear(); window.location.reload(); }} style={{ color: "#ff4444", background: "none", border: "none", cursor: "pointer" }}>Salir</button>
            </>
          ) : (
            <button onClick={() => window.location.href="/login"} style={{ backgroundColor: "#3b82f6", color: "#fff", border: "none", padding: "8px 20px", borderRadius: "20px", cursor: "pointer" }}>Iniciar Sesión</button>
          )}
        </div>
      </header>

      <main style={{ padding: "3rem 4rem" }}>
        <h2 style={{ marginBottom: "2rem" }}>Catálogo Disponible</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "2rem" }}>
          {vehiculos.map(v => (
            <div key={v.id} style={{ backgroundColor: "#111", borderRadius: "15px", border: "1px solid #222", overflow: "hidden" }}>
              <div style={{ height: "160px", backgroundColor: "#1a1a1a", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "3rem" }}>🚗</div>
              <div style={{ padding: "1.5rem" }}>
                <h3 style={{ margin: "0" }}>{v.marca} {v.modelo}</h3>
                <p style={{ color: "#3b82f6", fontWeight: "bold", fontSize: "1.2rem" }}>{v.precio.toLocaleString()} €</p>
                
                <div style={{ display: "flex", gap: "10px", marginTop: "1rem" }}>
                  <button 
                    onClick={() => handleAccionRestringida("comprar este vehículo")}
                    style={{ flex: 2, padding: "10px", backgroundColor: "#fff", color: "#000", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}
                  >
                    Comprar
                  </button>
                  <button 
                    onClick={() => handleAccionRestringida("guardar en favoritos")}
                    style={{ flex: 1, padding: "10px", backgroundColor: "#222", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer" }}
                  >
                    ❤️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
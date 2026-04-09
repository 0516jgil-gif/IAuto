"use client";
import { useState, useEffect } from "react";

export default function InicioIAuto() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Estilo base para los enlaces
  const navLinkStyle = { 
    color: "#ccc", 
    textDecoration: "none", 
    marginLeft: "1.5rem", 
    fontSize: "0.85rem",
    fontWeight: "500",
    transition: "color 0.2s"
  };

  return (
    <div style={{ backgroundColor: "#000", color: "#fff", fontFamily: "sans-serif" }}>
      
      {/* HEADER ACTUALIZADO */}
      <header style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "1rem 4rem", position: "fixed", width: "100%", top: 0,
        backgroundColor: isScrolled ? "rgba(0,0,0,0.95)" : "transparent",
        backdropFilter: isScrolled ? "blur(10px)" : "none",
        transition: "0.3s", zIndex: 1000, boxSizing: "border-box",
        borderBottom: isScrolled ? "1px solid #222" : "none"
      }}>
        <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#3b82f6", letterSpacing: "1px" }}>
          IAUTO
        </div>

        <nav style={{ display: "flex", alignItems: "center" }}>
          {/* Enlaces a tus páginas internas */}
          <a href="/" style={navLinkStyle}>Inicio</a>
          <a href="/Vehiculos" style={navLinkStyle}>Vehículos</a>
          <a href="/Clientes" style={navLinkStyle}>Admin Clientes</a>
          <a href="/Empleados" style={navLinkStyle}>Personal</a>
          <a href="/Ventas" style={navLinkStyle}>Ventas</a>
          
          {/* Botón destacado para el Perfil/Login */}
          <a href="/login" style={{ 
            ...navLinkStyle, 
            backgroundColor: "#3b82f6", 
            padding: "0.6rem 1.2rem", 
            borderRadius: "20px", 
            color: "#fff",
            marginLeft: "2rem" 
          }}>
            Mi Cuenta
          </a>
        </nav>
      </header>

      {/* HERO SECTION */}
      <section style={{
        height: "90vh", display: "flex", flexDirection: "column", 
        justifyContent: "center", alignItems: "center", textAlign: "center",
        backgroundImage: "linear-gradient(rgba(0,0,0,0.7), #000), url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1920')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}>
        <h1 style={{ fontSize: "4rem", marginBottom: "1rem", fontWeight: "800" }}>Conduce el Futuro</h1>
        <p style={{ color: "#aaa", maxWidth: "600px", fontSize: "1.1rem", lineHeight: "1.5" }}>
          La plataforma inteligente para gestionar tu próximo vehículo con la tecnología de IAuto.
        </p>
        <button 
          onClick={() => window.location.href = "/Vehiculos"}
          style={{ 
            marginTop: "2rem", padding: "1rem 2rem", backgroundColor: "#fff", 
            color: "#000", border: "none", borderRadius: "30px", 
            fontWeight: "bold", cursor: "pointer", fontSize: "1rem" 
          }}
        >
          Ver Inventario
        </button>
      </section>

      {/* SECCIÓN NOSOTROS */}
      <section id="nosotros" style={{ padding: "8rem 4rem", maxWidth: "1000px", margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ color: "#3b82f6", fontSize: "2.5rem", marginBottom: "1.5rem" }}>¿Quién es IAuto?</h2>
        <p style={{ lineHeight: "1.8", color: "#bbb", fontSize: "1.2rem" }}>
          IAuto nace como un proyecto de innovación (TFG) diseñado para digitalizar por completo la experiencia 
          de compra y gestión automotriz. Unimos a clientes y concesionarios en un entorno 
          donde la transparencia y la rapidez son nuestra máxima prioridad.
        </p>
      </section>

      <footer style={{ padding: "4rem", textAlign: "center", borderTop: "1px solid #111", color: "#444" }}>
        © 2026 IAuto TFG Project
      </footer>
    </div>
  );
}
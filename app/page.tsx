"use client";

import { useEffect, useState } from "react";

export default function InicioIAuto() {
  const [isScrolled, setIsScrolled] = useState(false);

  // Efecto para cambiar el estilo del header al hacer scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- ESTILOS ---
  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: isScrolled ? "0.8rem 4rem" : "1.5rem 4rem",
    backgroundColor: isScrolled ? "rgba(0, 0, 0, 0.9)" : "transparent",
    backdropFilter: isScrolled ? "blur(10px)" : "none",
    borderBottom: isScrolled ? "1px solid #333" : "none",
    position: "fixed",
    top: 0,
    width: "100%",
    zIndex: 1000,
    transition: "all 0.3s ease",
    boxSizing: "border-box"
  };

  const navLinkStyle = {
    color: "#ccc",
    textDecoration: "none",
    fontSize: "0.9rem",
    fontWeight: "500",
    marginLeft: "2rem",
    transition: "color 0.2s"
  };

  const heroStyle = {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundImage: "linear-gradient(rgba(0,0,0,0.6), #000), url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1920')", // Imagen de coche elegante
    backgroundSize: "cover",
    backgroundPosition: "center",
    textAlign: "center",
    padding: "0 2rem"
  };

  const sectionStyle = {
    padding: "5rem 4rem",
    maxWidth: "1100px",
    margin: "0 auto"
  };

  return (
    <div style={{ backgroundColor: "#000", color: "#fff", fontFamily: "'Inter', sans-serif" }}>
      
      {/* HEADER / NAVIGATION */}
      <header style={headerStyle}>
        <div style={{ fontSize: "1.5rem", fontWeight: "bold", letterSpacing: "2px", color: "#3b82f6" }}>
          IAUTO
        </div>
        <nav>
          <a href="#" style={navLinkStyle}>Inicio</a>
          <a href="#nosotros" style={navLinkStyle}>Nosotros</a>
          <a href="/catalogo" style={navLinkStyle}>Catálogo</a>
          <a href="/perfil" style={{ 
            ...navLinkStyle, 
            backgroundColor: "#3b82f6", 
            color: "white", 
            padding: "0.5rem 1.2rem", 
            borderRadius: "20px" 
          }}>Mi Cuenta</a>
        </nav>
      </header>

      {/* HERO SECTION */}
      <section style={heroStyle}>
        <h1 style={{ fontSize: "4rem", marginBottom: "1rem", fontWeight: "800" }}>
          Conduce el Futuro
        </h1>
        <p style={{ fontSize: "1.2rem", color: "#aaa", maxWidth: "600px", marginBottom: "2rem" }}>
          La plataforma inteligente para encontrar, gestionar y disfrutar de tu próximo vehículo con la tecnología de IAuto.
        </p>
        <button style={{ 
          padding: "1rem 2.5rem", 
          backgroundColor: "#fff", 
          color: "#000", 
          border: "none", 
          borderRadius: "30px", 
          fontWeight: "bold", 
          cursor: "pointer",
          fontSize: "1rem"
        }}>
          Explorar Catálogo
        </button>
      </section>

      {/* QUIÉNES SOMOS */}
      <section id="nosotros" style={sectionStyle}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>
          <div>
            <h2 style={{ fontSize: "2.5rem", color: "#3b82f6", marginBottom: "1.5rem" }}>¿Quién es IAuto?</h2>
            <p style={{ lineHeight: "1.8", color: "#bbb", fontSize: "1.1rem" }}>
              En <strong>IAuto</strong>, no solo vendemos coches; transformamos la experiencia de adquisición automotriz. 
              Nacimos como un proyecto tecnológico (TFG) enfocado en la transparencia y la eficiencia.
            </p>
            <p style={{ lineHeight: "1.8", color: "#bbb", fontSize: "1.1rem", marginTop: "1rem" }}>
              Nuestra misión es conectar a los conductores con su vehículo ideal mediante un sistema inteligente de gestión 
              que permite seguir trámites en tiempo real y personalizar tus preferencias como nunca antes.
            </p>
          </div>
          <div style={{ 
            backgroundColor: "#111", 
            padding: "2rem", 
            borderRadius: "20px", 
            border: "1px solid #222",
            textAlign: "center" 
          }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🚀</div>
            <h4 style={{ marginBottom: "0.5rem" }}>Innovación Constante</h4>
            <p style={{ color: "#666" }}>Implementamos las últimas tecnologías web para que tu gestión sea rápida y segura.</p>
          </div>
        </div>
      </section>

      {/* SERVICIOS / CARACTERÍSTICAS */}
      <section style={{ ...sectionStyle, backgroundColor: "#050505" }}>
        <h2 style={{ textAlign: "center", marginBottom: "3rem" }}>Lo que ofrecemos</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "2rem" }}>
          {[
            { t: "Catálogo Curado", d: "Selección exclusiva de vehículos revisados.", i: "💎" },
            { t: "Gestión Online", d: "Sigue tu trámite de compra desde tu perfil.", i: "📁" },
            { t: "Favoritos Inteligentes", d: "Guarda lo que te gusta y recibe ofertas.", i: "❤️" }
          ].map((item, index) => (
            <div key={index} style={{ padding: "2rem", backgroundColor: "#111", borderRadius: "15px", textAlign: "center" }}>
              <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>{item.i}</div>
              <h3 style={{ marginBottom: "0.5rem" }}>{item.t}</h3>
              <p style={{ color: "#666", fontSize: "0.9rem" }}>{item.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER SIMPLE */}
      <footer style={{ padding: "3rem 4rem", borderTop: "1px solid #222", textAlign: "center", color: "#444" }}>
        <p>© 2026 IAuto TFG Project. Todos los derechos reservados.</p>
      </footer>

    </div>
  );
}
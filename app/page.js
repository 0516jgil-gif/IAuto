"use client";
import { useState, useEffect } from "react";

export default function InicioIAuto() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinkStyle = { color: "#ccc", textDecoration: "none", marginLeft: "2rem", fontSize: "0.9rem" };

  return (
    <div style={{ backgroundColor: "#000", color: "#fff", fontFamily: "sans-serif" }}>
      {/* HEADER */}
      <header style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "1rem 4rem", position: "fixed", width: "100%", top: 0,
        backgroundColor: isScrolled ? "rgba(0,0,0,0.9)" : "transparent",
        transition: "0.3s", zIndex: 1000, boxSizing: "border-box"
      }}>
        <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#3b82f6" }}>IAUTO</div>
        <nav>
          <a href="#nosotros" style={navLinkStyle}>Nosotros</a>
          <a href="/login" style={{ ...navLinkStyle, backgroundColor: "#3b82f6", padding: "0.5rem 1rem", borderRadius: "20px", color: "#fff" }}>Mi Cuenta</a>
        </nav>
      </header>

      {/* HERO SECTION */}
      <section style={{
        height: "80vh", display: "flex", flexDirection: "column", 
        justifyContent: "center", alignItems: "center", textAlign: "center",
        backgroundImage: "linear-gradient(rgba(0,0,0,0.7), #000), url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1920')",
        backgroundSize: "cover"
      }}>
        <h1 style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>Conduce el Futuro</h1>
        <p style={{ color: "#aaa", maxWidth: "600px" }}>La plataforma inteligente para gestionar tu próximo vehículo con la tecnología de IAuto.</p>
      </section>

      {/* QUIÉNES SOMOS */}
      <section id="nosotros" style={{ padding: "5rem 4rem", maxWidth: "1000px", margin: "0 auto" }}>
        <h2 style={{ color: "#3b82f6" }}>¿Quién es IAuto?</h2>
        <p style={{ lineHeight: "1.6", color: "#bbb" }}>
          IAuto nace como un proyecto de innovación (TFG) para digitalizar la experiencia de compra de vehículos. 
          Queremos que el cliente tenga el control total de sus datos y trámites en tiempo real.
        </p>
      </section>
    </div>
  );
}
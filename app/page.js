"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function InicioIAuto() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    const userId = localStorage.getItem("userId");
    const lastActivity = localStorage.getItem("lastActivity");
    const rol = localStorage.getItem("userRol");
    const adminName = localStorage.getItem("userName");
    const ahora = new Date().getTime();

    const esTrabajador = ["admin", "trabajador", "administrador"].includes((rol || "").toLowerCase());

    if (
      userId &&
      lastActivity &&
      ahora - parseInt(lastActivity) < 30 * 60 * 1000
    ) {
      if (esTrabajador && adminName) {
        Promise.resolve().then(() => {
          setUsuario({ nombre: adminName });
          setIsAdmin(true);
        });
      } else {
        fetch("/api/Clientes")
          .then((r) => r.json())
          .then((data) => {
            const user = data.find((c) => c.id === parseInt(userId));
            if (user) setUsuario(user);
          });
      }
    } else if (userId) {
      localStorage.clear();
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLink = {
    color: "#aaa",
    textDecoration: "none",
    marginLeft: "1.5rem",
    fontSize: "0.88rem",
    fontWeight: "500",
    transition: "0.2s",
  };

  return (
    <div
      style={{
        backgroundColor: "#000",
        color: "#fff",
        fontFamily: "sans-serif",
      }}
    >
      {/* HEADER */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem 4rem",
          position: "fixed",
          top: 0,
          width: "100%",
          zIndex: 1000,
          boxSizing: "border-box",
          transition: "0.3s",
          backgroundColor: isScrolled
            ? "rgba(0,0,0,0.95)"
            : "transparent",
          backdropFilter: isScrolled ? "blur(10px)" : "none",
          borderBottom: isScrolled
            ? "1px solid #111"
            : "none",
        }}
      >
        <div
          style={{
            fontSize: "1.5rem",
            fontWeight: "800",
            color: "#3b82f6",
            letterSpacing: "2px",
          }}
        >
          IAUTO
        </div>

        <nav
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Link href="/" style={navLink}>
            Inicio
          </Link>

          <Link href="/Vehiculos" style={navLink}>
            Vehículos
          </Link>

          {/* SOLO TRABAJADORES */}
          {isAdmin && (
            <Link
              href="/Empleados"
              style={{
                ...navLink,
                color: "#a78bfa",
              }}
            >
              🔒 Panel
            </Link>
          )}

          {/* BOTÓN CUENTA */}
          <Link
            href={
              usuario
                ? isAdmin
                  ? "/Empleados"
                  : "/perfil"
                : "/login"
            }
            style={{
              ...navLink,
              backgroundColor: isAdmin
                ? "#7c3aed"
                : "#3b82f6",
              padding: "0.55rem 1.2rem",
              borderRadius: "20px",
              color: "#fff",
              marginLeft: "2rem",
            }}
          >
            {usuario
              ? `Hola, ${(usuario.nombre || "Usuario").split(" ")[0]}`
              : "Mi Cuenta"}
          </Link>
        </nav>
      </header>

      {/* HERO */}
      <section
        className="iauto-hero"
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          padding: "0 2rem",
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.65), #000), url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1920')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <p
          style={{
            color: "#3b82f6",
            fontSize: "0.85rem",
            letterSpacing: "4px",
            textTransform: "uppercase",
            marginBottom: "1rem",
          }}
        >
          La plataforma del futuro
        </p>

        <h1
          style={{
            fontSize: "clamp(2.5rem, 6vw, 5rem)",
            fontWeight: "800",
            marginBottom: "1rem",
          }}
        >
          Conduce el Futuro
        </h1>

        <p
          style={{
            color: "#777",
            maxWidth: "550px",
            lineHeight: "1.8",
            fontSize: "1.1rem",
            marginBottom: "2rem",
          }}
        >
          La plataforma inteligente para gestionar tu próximo
          vehículo con la tecnología de IAuto.
        </p>

        <div
          style={{
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <button
            onClick={() =>
              (window.location.href = "/Vehiculos")
            }
            style={{
              padding: "1rem 2.4rem",
              borderRadius: "30px",
              border: "none",
              backgroundColor: "#fff",
              color: "#000",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            {usuario
              ? "Continuar Buscando"
              : "Ver Inventario"}
          </button>

          {!usuario && (
            <button
              onClick={() =>
                (window.location.href = "/login")
              }
              style={{
                padding: "1rem 2.4rem",
                borderRadius: "30px",
                border: "1px solid #333",
                backgroundColor: "transparent",
                color: "#fff",
                fontWeight: "700",
                cursor: "pointer",
              }}
            >
              Iniciar Sesión
            </button>
          )}
        </div>
      </section>

      {/* FEATURES */}
      <section
        style={{
          padding: "7rem 4rem",
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "4rem",
          }}
        >
          <h2
            style={{
              color: "#3b82f6",
              fontSize: "2.5rem",
              marginBottom: "1rem",
            }}
          >
            ¿Por qué IAuto?
          </h2>

          <p style={{ color: "#555" }}>
            Todo lo que necesitas en un solo lugar
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(280px,1fr))",
            gap: "2rem",
          }}
        >
          {[
            {
              icon: "🔍",
              title: "Catálogo completo",
              desc: "Explora cientos de vehículos con filtros inteligentes.",
            },
            {
              icon: "⚡",
              title: "Gestión rápida",
              desc: "Proceso digital sin papeleo ni esperas.",
            },
            {
              icon: "🛡️",
              title: "100% seguro",
              desc: "Datos protegidos y compras seguras.",
            },
          ].map((item) => (
            <div
              key={item.title}
              style={{
                backgroundColor: "#0d0d0d",
                border: "1px solid #1a1a1a",
                borderRadius: "20px",
                padding: "2rem",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "2.5rem",
                  marginBottom: "1rem",
                }}
              >
                {item.icon}
              </div>

              <h3
                style={{
                  marginBottom: "1rem",
                }}
              >
                {item.title}
              </h3>

              <p
                style={{
                  color: "#555",
                  lineHeight: "1.7",
                }}
              >
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section
        style={{
          padding: "6rem 4rem",
          backgroundColor: "#050505",
          textAlign: "center",
          borderTop: "1px solid #111",
        }}
      >
        <h2
          style={{
            fontSize: "2rem",
            marginBottom: "1rem",
          }}
        >
          ¿Quién es IAuto?
        </h2>

        <p
          style={{
            color: "#666",
            maxWidth: "750px",
            margin: "0 auto",
            lineHeight: "1.9",
          }}
        >
          IAuto nace como proyecto TFG para digitalizar
          completamente la experiencia de compra y gestión
          automotriz.
        </p>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          padding: "3rem",
          textAlign: "center",
          borderTop: "1px solid #111",
          color: "#333",
          fontSize: "0.85rem",
        }}
      >
        © 2026 IAuto TFG Project — Todos los derechos
        reservados
      </footer>
    </div>
  );
}

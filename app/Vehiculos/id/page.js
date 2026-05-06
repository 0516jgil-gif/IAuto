"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function VehiculoDetalle() {
  const { id } = useParams();
  const router = useRouter();

  const [vehiculo, setVehiculo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // Auth check
    const userId = localStorage.getItem("userId");
    const lastActivity = localStorage.getItem("lastActivity");
    const rol = localStorage.getItem("userRol");
    const adminName = localStorage.getItem("userName");
    const ahora = new Date().getTime();

    if (userId && lastActivity && ahora - parseInt(lastActivity) < 30 * 60 * 1000) {
      setIsLogged(true);
      localStorage.setItem("lastActivity", ahora.toString());
      if (rol === "admin") {
        setIsAdmin(true);
        setUserName(adminName || "Admin");
      } else {
        fetch("/api/Clientes")
          .then((r) => r.json())
          .then((data) => {
            const user = data.find((c) => c.id === parseInt(userId));
            if (user) setUserName(user.nombre);
          });
      }
    }

    // Fetch vehicle
    fetch(`/api/Vehiculos/${id}`)
      .then((r) => {
        if (r.status === 404) { setNotFound(true); return null; }
        return r.json();
      })
      .then((data) => {
        if (data) setVehiculo(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleAccion = (accion) => {
    if (!isLogged) {
      alert(`Para ${accion} debes iniciar sesión.`);
      router.push("/login");
    } else {
      alert(`✅ ${accion.charAt(0).toUpperCase() + accion.slice(1)} registrado correctamente.`);
    }
  };

  // ── Estilos comunes ──
  const card = {
    backgroundColor: "#0d0d0d",
    border: "1px solid #1a1a1a",
    borderRadius: "16px",
    padding: "1.2rem",
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: "#000", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: "sans-serif" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "2rem", marginBottom: "1rem", animation: "pulse 1.5s infinite" }}>🚗</div>
          <p style={{ color: "#555" }}>Cargando vehículo...</p>
        </div>
      </div>
    );
  }

  if (notFound || !vehiculo) {
    return (
      <div style={{ backgroundColor: "#000", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: "sans-serif" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🔍</div>
          <h2>Vehículo no encontrado</h2>
          <p style={{ color: "#555", marginBottom: "2rem" }}>Este vehículo no existe o ha sido eliminado.</p>
          <button onClick={() => router.push("/Vehiculos")} style={{ backgroundColor: "#3b82f6", color: "#fff", border: "none", padding: "12px 28px", borderRadius: "12px", cursor: "pointer", fontWeight: "700" }}>
            ← Volver al catálogo
          </button>
        </div>
      </div>
    );
  }

  const disponible = vehiculo.stock > 0;

  // ── Campos a mostrar según los datos que tenga el vehículo ──
  const specs = [
    { label: "Marca",        value: vehiculo.marca },
    { label: "Modelo",       value: vehiculo.modelo },
    { label: "Precio",       value: `${vehiculo.precio?.toLocaleString()} €` },
    { label: "Stock",        value: disponible ? `${vehiculo.stock} unidades` : "Agotado" },
    vehiculo.tipo        && { label: "Tipo",         value: vehiculo.tipo },
    vehiculo.carroceria  && { label: "Carrocería",   value: vehiculo.carroceria },
    vehiculo.combustible && { label: "Combustible",  value: vehiculo.combustible },
    vehiculo.potencia    && { label: "Potencia",     value: `${vehiculo.potencia} CV` },
    vehiculo.motor       && { label: "Motor",        value: vehiculo.motor },
    vehiculo.transmision && { label: "Transmisión",  value: vehiculo.transmision },
    vehiculo.color       && { label: "Color",        value: vehiculo.color },
    vehiculo.anio != null  && { label: "Año",          value: vehiculo.anio },
    (vehiculo.kmRecorridos ?? vehiculo.kilometros ?? vehiculo.km) != null && {
      label: "Kilómetros",
      value: `${Number(vehiculo.kmRecorridos ?? vehiculo.kilometros ?? vehiculo.km).toLocaleString()} km`,
    },
    vehiculo.puertas     && { label: "Puertas",      value: vehiculo.puertas },
    vehiculo.plazas      && { label: "Plazas",       value: vehiculo.plazas },
  ].filter(Boolean);

  return (
    <div style={{ backgroundColor: "#000", minHeight: "100vh", color: "#fff", fontFamily: "sans-serif" }}>

      {/* HEADER */}
      <header style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "1.2rem 4rem", borderBottom: "1px solid #111",
        position: "sticky", top: 0, backgroundColor: "rgba(0,0,0,0.95)",
        backdropFilter: "blur(12px)", zIndex: 100,
      }}>
        <h1 onClick={() => router.push("/")} style={{ cursor: "pointer", color: "#3b82f6", margin: 0, fontWeight: "800", letterSpacing: "2px" }}>
          IAUTO
        </h1>
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          {isAdmin && (
            <a href="/Empleados" style={{ color: "#a78bfa", fontSize: "0.85rem", textDecoration: "none", fontWeight: "600" }}>
              🔒 Admin
            </a>
          )}
          {isLogged ? (
            <>
              <span style={{ color: "#aaa", fontSize: "0.9rem" }}>Hola, <strong style={{ color: "#fff" }}>{userName}</strong></span>
              {!isAdmin && (
                <button onClick={() => router.push("/perfil")} style={{ background: "none", border: "1px solid #333", color: "#fff", padding: "6px 16px", borderRadius: "20px", cursor: "pointer", fontSize: "0.85rem" }}>
                  Mi Perfil
                </button>
              )}
              <button onClick={() => { localStorage.clear(); router.push("/"); }} style={{ color: "#ef4444", background: "none", border: "none", cursor: "pointer", fontSize: "0.85rem" }}>
                Salir
              </button>
            </>
          ) : (
            <button onClick={() => router.push("/login")} style={{ backgroundColor: "#3b82f6", color: "#fff", border: "none", padding: "8px 22px", borderRadius: "20px", cursor: "pointer", fontWeight: "600" }}>
              Iniciar Sesión
            </button>
          )}
        </div>
      </header>

      <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "3rem 2rem" }}>

        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "2rem", fontSize: "0.85rem", color: "#555" }}>
          <span onClick={() => router.push("/Vehiculos")} style={{ cursor: "pointer", color: "#3b82f6" }}>Catálogo</span>
          <span>›</span>
          <span style={{ color: "#aaa" }}>{vehiculo.marca} {vehiculo.modelo}</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2.5rem" }}>

          {/* ── Columna izquierda: imagen ── */}
          <div>
            <div style={{
              height: "360px", borderRadius: "20px",
              border: "1px solid #1a1a1a", backgroundColor: "#111",
              backgroundImage: "radial-gradient(circle at 50% 45%, #1e3a8a 0%, #111827 36%, #050505 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "6rem", marginBottom: "1rem",
            }}>
              🚗
            </div>

            {/* Badge disponibilidad */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              backgroundColor: disponible ? "#064e3b" : "#450a0a",
              color: disponible ? "#10b981" : "#ef4444",
              padding: "6px 16px", borderRadius: "20px", fontSize: "0.85rem", fontWeight: "700",
            }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "currentColor", display: "inline-block" }} />
              {disponible ? `Disponible · ${vehiculo.stock} en stock` : "Agotado"}
            </div>
          </div>

          {/* ── Columna derecha: info ── */}
          <div>
            <p style={{ color: "#3b82f6", margin: "0 0 0.4rem", fontSize: "0.78rem", fontWeight: "800", letterSpacing: "1.5px", textTransform: "uppercase" }}>
              {vehiculo.marca}
            </p>
            <h1 style={{ margin: "0 0 0.5rem", fontSize: "2.4rem", lineHeight: 1.1 }}>
              {vehiculo.modelo}
            </h1>
            <p style={{ color: "#3b82f6", fontWeight: "800", fontSize: "2.2rem", margin: "1rem 0 1.8rem" }}>
              {vehiculo.precio?.toLocaleString()} €
            </p>

            {/* Especificaciones dinámicas */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "0.75rem", marginBottom: "2rem" }}>
              {specs.map(({ label, value }) => (
                <div key={label} style={card}>
                  <p style={{ color: "#555", margin: "0 0 0.3rem", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "1px", fontWeight: "700" }}>
                    {label}
                  </p>
                  <p style={{ color: "#fff", margin: 0, fontWeight: "700", fontSize: "0.95rem" }}>
                    {String(value)}
                  </p>
                </div>
              ))}
            </div>

            {/* Descripción si existe */}
            {vehiculo.descripcion && (
              <div style={{ ...card, marginBottom: "1.5rem" }}>
                <p style={{ color: "#555", margin: "0 0 0.5rem", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "1px", fontWeight: "700" }}>
                  Descripción
                </p>
                <p style={{ color: "#aaa", margin: 0, lineHeight: 1.7, fontSize: "0.95rem" }}>
                  {vehiculo.descripcion}
                </p>
              </div>
            )}

            {/* Extras si existen */}
            {Array.isArray(vehiculo.extras) && vehiculo.extras.length > 0 && (
              <div style={{ ...card, marginBottom: "1.5rem" }}>
                <p style={{ color: "#555", margin: "0 0 0.75rem", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "1px", fontWeight: "700" }}>
                  Extras y equipamiento
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {vehiculo.extras.map((extra, i) => (
                    <span key={i} style={{ backgroundColor: "#111", border: "1px solid #222", color: "#ccc", padding: "4px 12px", borderRadius: "20px", fontSize: "0.82rem" }}>
                      {extra}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Botones de acción */}
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button
                onClick={() => handleAccion("comprar este vehículo")}
                disabled={!disponible}
                style={{
                  flex: 2, padding: "14px",
                  backgroundColor: disponible ? "#fff" : "#222",
                  color: disponible ? "#000" : "#555",
                  border: "none", borderRadius: "14px",
                  fontWeight: "800", cursor: disponible ? "pointer" : "not-allowed",
                  fontSize: "1rem", transition: "opacity 0.2s",
                }}
              >
                {disponible ? "Comprar ahora" : "Sin stock"}
              </button>
              <button
                onClick={() => handleAccion("guardar en favoritos")}
                style={{
                  flex: 1, padding: "14px",
                  backgroundColor: "#111", border: "1px solid #222",
                  color: "#fff", borderRadius: "14px",
                  cursor: "pointer", fontSize: "1.1rem",
                }}
              >
                ❤️
              </button>
              <button
                onClick={() => router.push("/Vehiculos")}
                style={{
                  flex: 1, padding: "14px",
                  backgroundColor: "#0d0d0d", border: "1px solid #1a1a1a",
                  color: "#555", borderRadius: "14px",
                  cursor: "pointer", fontSize: "0.85rem",
                }}
              >
                ← Volver
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
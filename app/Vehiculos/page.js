"use client";
import { useEffect, useState } from "react";

export default function ListaVehiculos() {
  const [vehiculos, setVehiculos] = useState([]);
  const [userName, setUserName] = useState("");
  const [isLogged, setIsLogged] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const lastActivity = localStorage.getItem("lastActivity");
    const rol = localStorage.getItem("userRol");
    const adminName = localStorage.getItem("userName");
    const ahora = new Date().getTime();

    if (userId && lastActivity && (ahora - parseInt(lastActivity) < 30 * 60 * 1000)) {
      setIsLogged(true);
      localStorage.setItem("lastActivity", ahora.toString());
      if (rol === "admin") {
        setIsAdmin(true);
        setUserName(adminName || "Admin");
      } else {
        fetch("/api/Clientes").then(r => r.json()).then(data => {
          const user = data.find(c => c.id === parseInt(userId));
          if (user) setUserName(user.nombre);
        });
      }
    } else {
      if (userId) localStorage.clear();
    }

    fetch("/api/Vehiculos").then(r => r.json()).then(setVehiculos);
  }, []);

  const handleAccion = (accion) => {
    if (!isLogged) {
      alert(`Para ${accion} debes iniciar sesión.`);
      window.location.href = "/login";
    } else {
      alert(`✅ ${accion.charAt(0).toUpperCase() + accion.slice(1)} registrado correctamente.`);
    }
  };

  const getKilometros = (vehiculo) =>
    vehiculo?.kmRecorridos ?? vehiculo?.kilometros ?? vehiculo?.km ?? vehiculo?.kilometraje;

  const getTipo = (vehiculo) =>
    vehiculo?.tipo ?? vehiculo?.categoria ?? vehiculo?.carroceria;

  const getFotos = (vehiculo) => {
    const fotos = vehiculo?.fotos ?? vehiculo?.imagenes;
    if (Array.isArray(fotos)) return fotos.filter(Boolean);
    return [vehiculo?.foto, vehiculo?.imagen, vehiculo?.imageUrl].filter(Boolean);
  };

  const filtrados = vehiculos.filter(v =>
    `${v.marca} ${v.modelo}`.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div style={{ backgroundColor: "#000", color: "#fff", minHeight: "100vh", fontFamily: "sans-serif" }}>

      {/* HEADER */}
      <header style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "1.2rem 4rem", borderBottom: "1px solid #111",
        position: "sticky", top: 0, backgroundColor: "rgba(0,0,0,0.95)",
        backdropFilter: "blur(12px)", zIndex: 100
      }}>
        <h1 onClick={() => window.location.href = "/"} style={{ cursor: "pointer", color: "#3b82f6", margin: 0, fontWeight: "800", letterSpacing: "2px" }}>
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
                <button onClick={() => window.location.href = "/perfil"} style={{ background: "none", border: "1px solid #333", color: "#fff", padding: "6px 16px", borderRadius: "20px", cursor: "pointer", fontSize: "0.85rem" }}>
                  Mi Perfil
                </button>
              )}
              <button onClick={() => { localStorage.clear(); window.location.reload(); }} style={{ color: "#ef4444", background: "none", border: "none", cursor: "pointer", fontSize: "0.85rem" }}>
                Salir
              </button>
            </>
          ) : (
            <button onClick={() => window.location.href = "/login"} style={{ backgroundColor: "#3b82f6", color: "#fff", border: "none", padding: "8px 22px", borderRadius: "20px", cursor: "pointer", fontWeight: "600" }}>
              Iniciar Sesión
            </button>
          )}
        </div>
      </header>

      <main style={{ padding: "3rem 4rem" }}>
        {/* Título + buscador */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2.5rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: "1.8rem" }}>Catálogo de Vehículos</h2>
            <p style={{ color: "#555", margin: "0.3rem 0 0", fontSize: "0.9rem" }}>{filtrados.length} vehículos disponibles</p>
          </div>
          <input
            placeholder="🔍  Buscar por marca o modelo..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            style={{
              backgroundColor: "#111", border: "1px solid #222", color: "#fff",
              padding: "10px 18px", borderRadius: "12px", fontSize: "0.9rem",
              outline: "none", width: "280px"
            }}
          />
        </div>

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
          {filtrados.map(v => (
            <div key={v.id} onClick={() => setVehiculoSeleccionado(v)} style={{
              backgroundColor: "#0d0d0d", borderRadius: "18px",
              border: "1px solid #1a1a1a", overflow: "hidden",
              transition: "transform 0.2s, border-color 0.2s",
              cursor: "pointer",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = "#3b82f6"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "#1a1a1a"; }}
            >
              <div style={{
                height: "170px", backgroundColor: "#111",
                display: "flex", justifyContent: "center", alignItems: "center",
                fontSize: "4rem",
                backgroundImage: "radial-gradient(circle at 50% 50%, #1a1a2e 0%, #0d0d0d 100%)"
              }}>🚗</div>
              <div style={{ padding: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                  <h3 style={{ margin: 0, fontSize: "1.1rem" }}>{v.marca} {v.modelo}</h3>
                  <span style={{
                    backgroundColor: v.stock > 0 ? "#064e3b" : "#450a0a",
                    color: v.stock > 0 ? "#10b981" : "#ef4444",
                    padding: "2px 8px", borderRadius: "10px", fontSize: "0.75rem", fontWeight: "600"
                  }}>
                    {v.stock > 0 ? "Disponible" : "Agotado"}
                  </span>
                </div>
                <p style={{ color: "#3b82f6", fontWeight: "700", fontSize: "1.3rem", margin: "0.5rem 0 1rem" }}>
                  {v.precio?.toLocaleString()} €
                </p>
                <div onClick={(e) => e.stopPropagation()} style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => handleAccion("comprar este vehículo")}
                    disabled={v.stock === 0}
                    style={{
                      flex: 2, padding: "10px", backgroundColor: v.stock > 0 ? "#fff" : "#222",
                      color: v.stock > 0 ? "#000" : "#555", border: "none", borderRadius: "10px",
                      fontWeight: "700", cursor: v.stock > 0 ? "pointer" : "not-allowed", fontSize: "0.9rem"
                    }}
                  >
                    Comprar
                  </button>
                  <button
                    onClick={() => handleAccion("guardar en favoritos")}
                    style={{ flex: 1, padding: "10px", backgroundColor: "#1a1a1a", border: "1px solid #222", color: "#fff", borderRadius: "10px", cursor: "pointer", fontSize: "1rem" }}
                  >
                    ❤️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtrados.length === 0 && (
          <div style={{ textAlign: "center", padding: "5rem", color: "#333" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍</div>
            <p>No se encontraron vehículos con ese criterio</p>
          </div>
        )}
      </main>

      {vehiculoSeleccionado && (
        <div
          onClick={() => setVehiculoSeleccionado(null)}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.78)",
            backdropFilter: "blur(10px)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "min(920px, 100%)",
              maxHeight: "90vh",
              overflowY: "auto",
              backgroundColor: "#080808",
              border: "1px solid #1f2937",
              borderRadius: "22px",
              boxShadow: "0 24px 90px rgba(59,130,246,0.18)",
            }}
          >
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1.5rem",
              padding: "1.5rem",
            }}>
              <div>
                <div style={{
                  height: "320px",
                  borderRadius: "18px",
                  overflow: "hidden",
                  border: "1px solid #1a1a1a",
                  backgroundColor: "#111",
                  backgroundImage: "radial-gradient(circle at 50% 45%, #1e3a8a 0%, #111827 36%, #050505 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  {getFotos(vehiculoSeleccionado)[0] ? (
                    <div
                      aria-label={`${vehiculoSeleccionado.marca} ${vehiculoSeleccionado.modelo}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        backgroundImage: `url(${getFotos(vehiculoSeleccionado)[0]})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                  ) : (
                    <span style={{ fontSize: "5rem" }}>🚗</span>
                  )}
                </div>

                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "0.75rem",
                  marginTop: "0.75rem",
                }}>
                  {(getFotos(vehiculoSeleccionado).slice(1, 4).length > 0
                    ? getFotos(vehiculoSeleccionado).slice(1, 4)
                    : [null, null, null]
                  ).map((foto, index) => (
                    <div key={index} style={{
                      height: "86px",
                      borderRadius: "14px",
                      border: "1px solid #1a1a1a",
                      backgroundColor: "#101010",
                      backgroundImage: foto ? "none" : "linear-gradient(135deg, #111827, #050505)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                      color: "#374151",
                      fontSize: "1.6rem",
                    }}>
                      {foto ? (
                        <div
                          aria-label={`Foto ${index + 2} de ${vehiculoSeleccionado.marca} ${vehiculoSeleccionado.modelo}`}
                          style={{
                            width: "100%",
                            height: "100%",
                            backgroundImage: `url(${foto})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }}
                        />
                      ) : "🚘"}
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ padding: "0.25rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "flex-start" }}>
                  <div>
                    <p style={{ color: "#3b82f6", margin: "0 0 0.35rem", fontSize: "0.78rem", fontWeight: "800", letterSpacing: "1.5px", textTransform: "uppercase" }}>
                      Detalle del vehiculo
                    </p>
                    <h2 style={{ margin: 0, fontSize: "2rem", lineHeight: 1.1 }}>
                      {vehiculoSeleccionado.marca} {vehiculoSeleccionado.modelo}
                    </h2>
                  </div>
                  <button
                    onClick={() => setVehiculoSeleccionado(null)}
                    aria-label="Cerrar ventana"
                    style={{
                      minWidth: "38px",
                      height: "38px",
                      borderRadius: "50%",
                      border: "1px solid #222",
                      backgroundColor: "#111",
                      color: "#fff",
                      cursor: "pointer",
                      fontSize: "1.2rem",
                    }}
                  >
                    ×
                  </button>
                </div>

                <p style={{ color: "#3b82f6", fontWeight: "800", fontSize: "1.9rem", margin: "1.1rem 0" }}>
                  {vehiculoSeleccionado.precio?.toLocaleString()} €
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "0.8rem", marginBottom: "1.2rem" }}>
                  {[
                    { label: "Marca", value: vehiculoSeleccionado.marca },
                    { label: "Tipo", value: getTipo(vehiculoSeleccionado) || "No disponible" },
                    {
                      label: "Km recorridos",
                      value: getKilometros(vehiculoSeleccionado) != null
                        ? `${Number(getKilometros(vehiculoSeleccionado)).toLocaleString()} km`
                        : "No disponible"
                    },
                    { label: "Stock", value: vehiculoSeleccionado.stock > 0 ? `${vehiculoSeleccionado.stock} uds.` : "Agotado" },
                  ].map(({ label, value }) => (
                    <div key={label} style={{
                      backgroundColor: "#0d0d0d",
                      border: "1px solid #1a1a1a",
                      borderRadius: "14px",
                      padding: "0.9rem",
                    }}>
                      <p style={{ color: "#555", margin: "0 0 0.35rem", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "1px", fontWeight: "700" }}>
                        {label}
                      </p>
                      <p style={{ color: "#fff", margin: 0, fontWeight: "700", fontSize: "0.98rem" }}>
                        {value}
                      </p>
                    </div>
                  ))}
                </div>

                <div style={{
                  borderTop: "1px solid #1a1a1a",
                  paddingTop: "1rem",
                  marginTop: "0.5rem",
                }}>
                  <p style={{ color: "#777", lineHeight: 1.6, margin: "0 0 1.2rem", fontSize: "0.94rem" }}>
                    Consulta la informacion principal del vehiculo antes de comprarlo o guardarlo en favoritos.
                  </p>

                  <div style={{ display: "flex", gap: "0.7rem" }}>
                    <button
                      onClick={() => handleAccion("comprar este vehÃ­culo")}
                      disabled={vehiculoSeleccionado.stock === 0}
                      style={{
                        flex: 2,
                        padding: "12px",
                        backgroundColor: vehiculoSeleccionado.stock > 0 ? "#fff" : "#222",
                        color: vehiculoSeleccionado.stock > 0 ? "#000" : "#555",
                        border: "none",
                        borderRadius: "12px",
                        fontWeight: "800",
                        cursor: vehiculoSeleccionado.stock > 0 ? "pointer" : "not-allowed",
                        fontSize: "0.95rem",
                      }}
                    >
                      Comprar
                    </button>
                    <button
                      onClick={() => handleAccion("guardar en favoritos")}
                      style={{
                        flex: 1,
                        padding: "12px",
                        backgroundColor: "#111",
                        border: "1px solid #222",
                        color: "#fff",
                        borderRadius: "12px",
                        cursor: "pointer",
                        fontSize: "1.05rem",
                      }}
                    >
                      ❤️
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

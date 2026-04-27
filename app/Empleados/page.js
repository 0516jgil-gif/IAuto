"use client";
import { useEffect, useState } from "react";

export default function PanelAdmin() {
  const [data, setData] = useState({ clientes: [], vehiculos: [], ventas: [] });
  const [loading, setLoading] = useState(true);
  const [adminName, setAdminName] = useState("");
  const [tab, setTab] = useState("clientes");

  useEffect(() => {
    const rol = localStorage.getItem("userRol");
    const nombre = localStorage.getItem("userName");
    if (rol !== "admin") {
      window.location.href = "/login";
      return;
    }
    setAdminName(nombre || "Admin");

    Promise.all([
      fetch("/api/Clientes").then(r => r.json()),
      fetch("/api/Vehiculos").then(r => r.json()),
      fetch("/api/Ventas").then(r => r.json()),
    ]).then(([clientes, vehiculos, ventas]) => {
      setData({ clientes, vehiculos, ventas });
      setLoading(false);
    });
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  if (loading) return (
    <div style={{ backgroundColor: "#000", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", color: "#fff" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>⚙️</div>
        <p>Cargando panel de administración...</p>
      </div>
    </div>
  );

  const tabStyle = (active) => ({
    padding: "10px 20px", border: "none", cursor: "pointer", borderRadius: "8px",
    fontWeight: "600", fontSize: "0.9rem", transition: "0.2s",
    backgroundColor: active ? "#3b82f6" : "#1a1a1a",
    color: active ? "#fff" : "#666",
  });

  const statCards = [
    { label: "Clientes", value: data.clientes.length, icon: "👥", color: "#3b82f6" },
    { label: "Vehículos", value: data.vehiculos.length, icon: "🚗", color: "#10b981" },
    { label: "Ventas", value: data.ventas.length, icon: "💰", color: "#f59e0b" },
    { label: "Ingresos", value: data.ventas.reduce((s, v) => s + (v.total || 0), 0).toLocaleString() + " €", icon: "📈", color: "#8b5cf6" },
  ];

  return (
    <div style={{ backgroundColor: "#050505", minHeight: "100vh", color: "#fff", fontFamily: "sans-serif" }}>

      {/* Header */}
      <header style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "1rem 3rem", backgroundColor: "#0d0d0d",
        borderBottom: "1px solid #1a1a1a", position: "sticky", top: 0, zIndex: 100
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span style={{ fontSize: "1.4rem", fontWeight: "800", color: "#3b82f6", letterSpacing: "1px" }}>IAUTO</span>
          <span style={{ color: "#333" }}>|</span>
          <span style={{ color: "#7c3aed", fontWeight: "600", fontSize: "0.9rem" }}>🔒 Panel Admin</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <span style={{ color: "#aaa", fontSize: "0.9rem" }}>Hola, <strong style={{ color: "#fff" }}>{adminName}</strong></span>
          <button
            onClick={() => window.location.href = "/"}
            style={{ background: "none", border: "1px solid #333", color: "#aaa", padding: "6px 16px", borderRadius: "20px", cursor: "pointer", fontSize: "0.85rem" }}
          >
            Ver web
          </button>
          <button
            onClick={handleLogout}
            style={{ background: "none", border: "1px solid #ef4444", color: "#ef4444", padding: "6px 16px", borderRadius: "20px", cursor: "pointer", fontSize: "0.85rem" }}
          >
            Salir
          </button>
        </div>
      </header>

      <main style={{ padding: "2.5rem 3rem", maxWidth: "1200px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "1.8rem", fontWeight: "700", marginBottom: "0.3rem" }}>Panel de Administración</h1>
        <p style={{ color: "#555", marginBottom: "2.5rem", fontSize: "0.9rem" }}>Gestión completa de la plataforma IAuto</p>

        {/* Stat Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
          {statCards.map(({ label, value, icon, color }) => (
            <div key={label} style={{
              backgroundColor: "#111", borderRadius: "16px", padding: "1.5rem",
              border: "1px solid #1f1f1f", position: "relative", overflow: "hidden"
            }}>
              <div style={{ position: "absolute", top: "-10px", right: "-10px", fontSize: "4rem", opacity: 0.06 }}>{icon}</div>
              <div style={{ fontSize: "1.8rem", marginBottom: "0.3rem" }}>{icon}</div>
              <p style={{ color: "#666", fontSize: "0.8rem", marginBottom: "0.3rem", textTransform: "uppercase", letterSpacing: "1px" }}>{label}</p>
              <p style={{ fontSize: "2rem", fontWeight: "800", color, margin: 0 }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
          {["clientes", "vehiculos", "ventas"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={tabStyle(tab === t)}>
              {t === "clientes" ? "👥 Clientes" : t === "vehiculos" ? "🚗 Vehículos" : "💰 Ventas"}
            </button>
          ))}
        </div>

        {/* Tabla Clientes */}
        {tab === "clientes" && (
          <div style={{ backgroundColor: "#0d0d0d", borderRadius: "16px", border: "1px solid #1a1a1a", overflow: "hidden" }}>
            <div style={{ padding: "1.2rem 1.5rem", borderBottom: "1px solid #1a1a1a" }}>
              <h3 style={{ margin: 0, fontSize: "1rem" }}>Lista de Clientes ({data.clientes.length})</h3>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ backgroundColor: "#111" }}>
                    {["ID", "Nombre", "Email", "Teléfono"].map(h => (
                      <th key={h} style={{ padding: "1rem 1.5rem", textAlign: "left", color: "#555", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "1px" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.clientes.map((c, i) => (
                    <tr key={c.id} style={{ borderTop: "1px solid #151515", backgroundColor: i % 2 === 0 ? "transparent" : "#0a0a0a" }}>
                      <td style={{ padding: "1rem 1.5rem", color: "#555", fontSize: "0.85rem" }}>#{c.id}</td>
                      <td style={{ padding: "1rem 1.5rem", fontWeight: "500" }}>{c.nombre}</td>
                      <td style={{ padding: "1rem 1.5rem", color: "#3b82f6" }}>{c.email}</td>
                      <td style={{ padding: "1rem 1.5rem", color: "#aaa" }}>{c.telefono}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tabla Vehículos */}
        {tab === "vehiculos" && (
          <div style={{ backgroundColor: "#0d0d0d", borderRadius: "16px", border: "1px solid #1a1a1a", overflow: "hidden" }}>
            <div style={{ padding: "1.2rem 1.5rem", borderBottom: "1px solid #1a1a1a" }}>
              <h3 style={{ margin: 0, fontSize: "1rem" }}>Inventario de Vehículos ({data.vehiculos.length})</h3>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ backgroundColor: "#111" }}>
                    {["ID", "Marca", "Modelo", "Precio", "Stock"].map(h => (
                      <th key={h} style={{ padding: "1rem 1.5rem", textAlign: "left", color: "#555", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "1px" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.vehiculos.map((v, i) => (
                    <tr key={v.id} style={{ borderTop: "1px solid #151515", backgroundColor: i % 2 === 0 ? "transparent" : "#0a0a0a" }}>
                      <td style={{ padding: "1rem 1.5rem", color: "#555", fontSize: "0.85rem" }}>#{v.id}</td>
                      <td style={{ padding: "1rem 1.5rem", fontWeight: "600" }}>{v.marca}</td>
                      <td style={{ padding: "1rem 1.5rem", color: "#aaa" }}>{v.modelo}</td>
                      <td style={{ padding: "1rem 1.5rem", color: "#10b981", fontWeight: "600" }}>{v.precio?.toLocaleString()} €</td>
                      <td style={{ padding: "1rem 1.5rem" }}>
                        <span style={{
                          backgroundColor: v.stock > 0 ? "#064e3b" : "#450a0a",
                          color: v.stock > 0 ? "#10b981" : "#ef4444",
                          padding: "3px 10px", borderRadius: "20px", fontSize: "0.8rem", fontWeight: "600"
                        }}>
                          {v.stock > 0 ? v.stock + " uds." : "Agotado"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tabla Ventas */}
        {tab === "ventas" && (
          <div style={{ backgroundColor: "#0d0d0d", borderRadius: "16px", border: "1px solid #1a1a1a", overflow: "hidden" }}>
            <div style={{ padding: "1.2rem 1.5rem", borderBottom: "1px solid #1a1a1a" }}>
              <h3 style={{ margin: 0, fontSize: "1rem" }}>Registro de Ventas ({data.ventas.length})</h3>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ backgroundColor: "#111" }}>
                    {["ID", "Cliente", "Empleado", "Vehículo", "Cant.", "Total", "Fecha"].map(h => (
                      <th key={h} style={{ padding: "1rem 1.5rem", textAlign: "left", color: "#555", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "1px" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.ventas.map((v, i) => (
                    <tr key={v.id} style={{ borderTop: "1px solid #151515", backgroundColor: i % 2 === 0 ? "transparent" : "#0a0a0a" }}>
                      <td style={{ padding: "1rem 1.5rem", color: "#555", fontSize: "0.85rem" }}>#{v.id}</td>
                      <td style={{ padding: "1rem 1.5rem" }}>{v.cliente?.nombre}</td>
                      <td style={{ padding: "1rem 1.5rem", color: "#aaa" }}>{v.empleado?.nombre}</td>
                      <td style={{ padding: "1rem 1.5rem" }}>{v.vehiculo?.marca} {v.vehiculo?.modelo}</td>
                      <td style={{ padding: "1rem 1.5rem", textAlign: "center" }}>{v.cantidad}</td>
                      <td style={{ padding: "1rem 1.5rem", color: "#f59e0b", fontWeight: "600" }}>{v.total?.toLocaleString()} €</td>
                      <td style={{ padding: "1rem 1.5rem", color: "#555", fontSize: "0.85rem" }}>
                        {v.fecha ? new Date(v.fecha).toLocaleDateString("es-ES") : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
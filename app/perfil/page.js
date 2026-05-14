"use client";
import { useEffect, useState } from "react";

export default function Perfil() {
  const [cliente, setCliente] = useState(null);
  const [favoritos, setFavoritos] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [ventaInfo, setVentaInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const rol = localStorage.getItem("userRol");
    if (!userId) { window.location.href = "/login"; return; }
    if (rol === "admin") { window.location.href = "/Empleados"; return; }

    const clienteId = Number(userId);

    Promise.all([
      fetch("/api/Clientes").then(r => r.json()),
      fetch(`/api/favoritos?clienteId=${clienteId}`).then(r => r.json()),
      fetch(`/api/ventas?clienteId=${clienteId}`).then(r => r.json()),
    ]).then(([clientes, favoritosData, ventasData]) => {
      const user = clientes.find(c => c.id === clienteId);
      setCliente(user);
      setFavoritos(Array.isArray(favoritosData) ? favoritosData : []);
      setVentas(Array.isArray(ventasData) ? ventasData : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleLogout = () => { localStorage.clear(); window.location.href = "/"; };

  const handleEliminarFavorito = async (vehiculoId) => {
    if (!cliente) return;

    const res = await fetch(`/api/favoritos?clienteId=${cliente.id}&vehiculoId=${vehiculoId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const data = await res.json();
      alert(data.error || "No se pudo eliminar el favorito.");
      return;
    }

    setFavoritos((actuales) => actuales.filter((fav) => fav.vehiculoId !== vehiculoId));
  };

  const cardStyle = {
    backgroundColor: "#0d0d0d",
    padding: "1.8rem",
    borderRadius: "16px",
    border: "1px solid #1a1a1a",
  };

  const itemStyle = {
    display: "flex",
    justifyContent: "space-between",
    gap: "1rem",
    alignItems: "center",
    padding: "0.85rem 0",
    borderTop: "1px solid #1a1a1a",
  };

  const nombreVehiculo = (vehiculo) => `${vehiculo?.marca || ""} ${vehiculo?.modelo || ""}`.trim() || "Vehiculo";
  const detalleLinea = (label, value) => (
    <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", padding: "0.7rem 0", borderTop: "1px solid #1a1a1a" }}>
      <span style={{ color: "#777" }}>{label}</span>
      <strong style={{ color: "#fff", textAlign: "right" }}>{value || "-"}</strong>
    </div>
  );

  if (loading) return (
    <div style={{ backgroundColor: "#000", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", color: "#fff" }}>
      Cargando...
    </div>
  );

  return (
    <div style={{ backgroundColor: "#050505", minHeight: "100vh", color: "#fff", fontFamily: "sans-serif" }}>

      <header style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "1rem 3rem", backgroundColor: "#0d0d0d", borderBottom: "1px solid #1a1a1a",
        position: "sticky", top: 0, zIndex: 100
      }}>
        <span onClick={() => window.location.href = "/"} style={{ fontSize: "1.4rem", fontWeight: "800", color: "#3b82f6", cursor: "pointer", letterSpacing: "2px" }}>IAUTO</span>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button onClick={() => window.location.href = "/Vehiculos"} style={{ background: "none", border: "1px solid #222", color: "#aaa", padding: "6px 16px", borderRadius: "20px", cursor: "pointer", fontSize: "0.85rem" }}>
            Ver Vehiculos
          </button>
          <button onClick={handleLogout} style={{ background: "none", border: "1px solid #ef4444", color: "#ef4444", padding: "6px 16px", borderRadius: "20px", cursor: "pointer", fontSize: "0.85rem" }}>
            Cerrar sesion
          </button>
        </div>
      </header>

      <main style={{ maxWidth: "980px", margin: "3rem auto", padding: "0 2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "3rem" }}>
          <div style={{
            width: "70px", height: "70px", borderRadius: "50%",
            backgroundColor: "#1a1a2e", display: "flex", justifyContent: "center",
            alignItems: "center", fontSize: "2rem", border: "2px solid #3b82f6"
          }}>
            {cliente?.nombre?.[0]?.toUpperCase()}
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: "1.6rem" }}>Hola, {cliente?.nombre}</h1>
            <p style={{ color: "#555", margin: "0.2rem 0 0", fontSize: "0.9rem" }}>Cliente IAuto</p>
          </div>
        </div>

        <div className="iauto-profile-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
          <section style={cardStyle}>
            <h3 style={{ color: "#3b82f6", marginTop: 0, fontSize: "1rem" }}>Mis Datos</h3>
            <div style={{ marginBottom: "1rem" }}>
              <p style={{ color: "#555", fontSize: "0.75rem", textTransform: "uppercase", marginBottom: "0.2rem" }}>Email</p>
              <p style={{ margin: 0 }}>{cliente?.email}</p>
            </div>
            <div>
              <p style={{ color: "#555", fontSize: "0.75rem", textTransform: "uppercase", marginBottom: "0.2rem" }}>Teléfono</p>
              <p style={{ margin: 0 }}>{cliente?.telefono || "No indicado"}</p>
            </div>
          </section>

          <section style={cardStyle}>
            <h3 style={{ color: "#ef4444", marginTop: 0, fontSize: "1rem" }}>Favoritos</h3>
            {favoritos.length === 0 ? (
              <p style={{ color: "#444", fontSize: "0.9rem", lineHeight: "1.6" }}>No tienes coches guardados todavia.</p>
            ) : (
              favoritos.map((favorito) => (
                <div key={favorito.id} className="iauto-profile-item" style={itemStyle}>
                  <div>
                    <p style={{ margin: "0 0 0.2rem", fontWeight: "700" }}>{nombreVehiculo(favorito.vehiculo)}</p>
                    <p style={{ margin: 0, color: "#3b82f6", fontSize: "0.9rem" }}>{favorito.vehiculo?.precio?.toLocaleString()} EUR</p>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button onClick={() => window.location.href = `/Vehiculos/${favorito.vehiculoId}`} style={{ padding: "7px 12px", backgroundColor: "#1a1a1a", color: "#fff", border: "1px solid #222", borderRadius: "8px", cursor: "pointer" }}>
                      Ver
                    </button>
                    <button onClick={() => handleEliminarFavorito(favorito.vehiculoId)} style={{ padding: "7px 12px", background: "none", color: "#ef4444", border: "1px solid #ef4444", borderRadius: "8px", cursor: "pointer" }}>
                      Quitar
                    </button>
                  </div>
                </div>
              ))
            )}
          </section>
        </div>

        <section style={{ ...cardStyle, marginTop: "1.5rem" }}>
          <h3 style={{ color: "#10b981", marginTop: 0, fontSize: "1rem" }}>Mis Compras</h3>
          {ventas.length === 0 ? (
            <>
              <p style={{ color: "#444", fontSize: "0.9rem" }}>No tienes compras registradas actualmente.</p>
              <button
                onClick={() => window.location.href = "/Vehiculos"}
                style={{ marginTop: "0.5rem", padding: "10px 22px", backgroundColor: "#3b82f6", color: "#fff", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "600" }}
              >
                Explorar Vehiculos
              </button>
            </>
          ) : (
            ventas.map((venta) => (
              <div key={venta.id} className="iauto-profile-item" style={itemStyle}>
                <div>
                  <p style={{ margin: "0 0 0.2rem", fontWeight: "700" }}>{nombreVehiculo(venta.vehiculo)}</p>
                  <p style={{ margin: 0, color: "#555", fontSize: "0.85rem" }}>
                    {new Date(venta.fecha).toLocaleDateString()} · {venta.cantidad} unidad(es)
                  </p>
                </div>
                <div style={{ textAlign: "right", display: "grid", justifyItems: "end", gap: "0.5rem" }}>
                  <p style={{ margin: "0 0 0.5rem", color: "#10b981", fontWeight: "800" }}>{venta.total?.toLocaleString()} EUR</p>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      onClick={() => setVentaInfo(venta)}
                      title="Información de compra"
                      style={{
                        width: "34px",
                        height: "34px",
                        borderRadius: "50%",
                        backgroundColor: "#172554",
                        color: "#60a5fa",
                        border: "1px solid #60a5fa",
                        cursor: "pointer",
                        fontWeight: "800",
                        fontSize: "1rem",
                        lineHeight: 1,
                      }}
                    >
                      i
                    </button>
                    <button onClick={() => window.location.href = `/Vehiculos/${venta.vehiculoId}`} style={{ padding: "7px 12px", backgroundColor: "#1a1a1a", color: "#fff", border: "1px solid #222", borderRadius: "8px", cursor: "pointer" }}>
                      Ver coche
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </section>
      </main>

      {ventaInfo && (
        <div className="iauto-modal" style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.72)", display: "flex", justifyContent: "center", alignItems: "center", padding: "1rem", zIndex: 1000 }}>
          <div className="iauto-modal-panel" style={{ width: "100%", maxWidth: "480px", backgroundColor: "#0d0d0d", border: "1px solid #222", borderRadius: "16px", padding: "1.5rem", boxShadow: "0 24px 70px rgba(0,0,0,0.55)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "flex-start", marginBottom: "1rem" }}>
              <div>
                <p style={{ color: "#3b82f6", margin: "0 0 0.25rem", fontSize: "0.75rem", fontWeight: "800", textTransform: "uppercase" }}>Información de compra</p>
                <h2 style={{ margin: 0, fontSize: "1.25rem" }}>Pedido #{ventaInfo.id}</h2>
              </div>
              <button onClick={() => setVentaInfo(null)} style={{ background: "none", border: "1px solid #333", color: "#aaa", borderRadius: "8px", width: "34px", height: "34px", cursor: "pointer" }}>x</button>
            </div>

            {detalleLinea("Vehículo", nombreVehiculo(ventaInfo.vehiculo))}
            {detalleLinea("Fecha", ventaInfo.fecha ? new Date(ventaInfo.fecha).toLocaleDateString("es-ES") : "-")}
            {detalleLinea("Cantidad", `${ventaInfo.cantidad} unidad(es)`)}
            {detalleLinea("Total", `${ventaInfo.total?.toLocaleString()} EUR`)}
            {detalleLinea("Empleado asignado", ventaInfo.empleado?.nombre)}
            {detalleLinea("Estado", "Compra registrada")}

            <button onClick={() => setVentaInfo(null)} style={{ width: "100%", marginTop: "1.2rem", padding: "0.75rem 1rem", backgroundColor: "#2563eb", border: "1px solid #60a5fa", color: "#fff", borderRadius: "10px", cursor: "pointer", fontWeight: "800" }}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

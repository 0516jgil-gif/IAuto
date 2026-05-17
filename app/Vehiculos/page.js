"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { showError, showSuccess, showWarning } from "@/lib/alerts";

export default function ListaVehiculos() {
  const [vehiculos, setVehiculos] = useState([]);
  const [userName, setUserName] = useState("");
  const [isLogged, setIsLogged] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [compraPendiente, setCompraPendiente] = useState(null);
  const [compraOpciones, setCompraOpciones] = useState({
    subvencion: true,
    seguro: "todo-riesgo",
    financiacion: false,
    garantia: true,
    entrega: "concesionario",
  });
  const [comprando, setComprando] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const lastActivity = localStorage.getItem("lastActivity");
    const rol = localStorage.getItem("userRol");
    const adminName = localStorage.getItem("userName");
    const ahora = new Date().getTime();

    if (userId && lastActivity && (ahora - parseInt(lastActivity) < 30 * 60 * 1000)) {
      localStorage.setItem("lastActivity", ahora.toString());
      Promise.resolve().then(() => {
        setIsLogged(true);
        if (["admin", "trabajador", "administrador"].includes(rol)) {
          setIsAdmin(true);
          setUserName(adminName || "Trabajador");
        } else {
          fetch("/api/Clientes").then(r => r.json()).then(data => {
            const user = data.find(c => c.id === parseInt(userId));
            if (user) setUserName(user.nombre);
          });
        }
      });
    } else {
      if (userId) localStorage.clear();
    }

    fetch("/api/Vehiculos").then(r => r.json()).then(setVehiculos);
  }, []);

  const validarCliente = (accion) => {
    if (!isLogged || ["admin", "trabajador", "administrador"].includes(localStorage.getItem("userRol"))) {
      showWarning(`Para ${accion} debes iniciar sesión como cliente.`);
      router.push("/login");
      return null;
    }
    return Number(localStorage.getItem("userId"));
  };

  const handleComprar = (vehiculo) => {
    const clienteId = validarCliente("comprar este vehículo");
    if (!clienteId) return;
    setCompraPendiente(vehiculo);
  };

  const confirmarCompra = async () => {
    if (!compraPendiente) return;
    const clienteId = Number(localStorage.getItem("userId"));
    setComprando(true);

    const res = await fetch("/api/ventas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clienteId, vehiculoId: compraPendiente.id, cantidad: 1, total: totalEstimado }),
    });
    const data = await res.json();
    setComprando(false);

    if (!res.ok) {
      showError(data.error || "No se pudo registrar la compra.");
      return;
    }

    setVehiculos((actuales) =>
      actuales.map((v) => v.id === compraPendiente.id ? { ...v, stock: Math.max(v.stock - 1, 0) } : v)
    );
    setCompraPendiente(null);
    showSuccess("Compra registrada correctamente. Ya aparece en tu perfil.");
  };

  const handleFavorito = async (vehiculoId) => {
    const clienteId = validarCliente("guardar en favoritos");
    if (!clienteId) return;

    const res = await fetch("/api/favoritos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clienteId, vehiculoId }),
    });
    const data = await res.json();

    if (!res.ok) {
      showError(data.error || "No se pudo guardar el favorito.");
      return;
    }

    showSuccess("Vehículo guardado en favoritos. Ya aparece en tu perfil.");
  };

  const filtrados = vehiculos.filter(v =>
    `${v.marca} ${v.modelo}`.toLowerCase().includes(busqueda.toLowerCase())
  );

  const seguroPrecio = compraOpciones.seguro === "todo-riesgo" ? 690 : compraOpciones.seguro === "terceros" ? 290 : 0;
  const extrasCompra =
    seguroPrecio +
    (compraOpciones.garantia ? 450 : 0) +
    (compraOpciones.entrega === "domicilio" ? 180 : 0);
  const descuentoSubvencion = compraOpciones.subvencion ? 1200 : 0;
  const totalEstimado = Math.max((compraPendiente?.precio || 0) + extrasCompra - descuentoSubvencion, 0);

  return (
    <div style={{ backgroundColor: "#000", color: "#fff", minHeight: "100vh", fontFamily: "sans-serif" }}>

      {/* HEADER */}
      <header style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "1.2rem 4rem", borderBottom: "1px solid #111",
        position: "sticky", top: 0, backgroundColor: "rgba(0,0,0,0.95)",
        backdropFilter: "blur(12px)", zIndex: 100
      }}>
        <h1 className="iauto-logo" onClick={() => router.push("/")} style={{ cursor: "pointer", color: "#3b82f6", margin: 0, fontWeight: "800", letterSpacing: "2px" }}>
          IAUTO
        </h1>
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          {isAdmin && (
            <a href="/Empleados" style={{ color: "#a78bfa", fontSize: "0.85rem", textDecoration: "none", fontWeight: "600" }}>
              🔒 Panel
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
              <button onClick={() => { localStorage.clear(); window.location.reload(); }} style={{ color: "#ef4444", background: "none", border: "none", cursor: "pointer", fontSize: "0.85rem" }}>
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

      <main style={{ padding: "3rem 4rem" }}>
        {/* Título + buscador */}
        <div className="iauto-list-toolbar" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2.5rem", flexWrap: "wrap", gap: "1rem" }}>
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
        <div className="iauto-card-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
          {filtrados.map(v => (
            <div
              key={v.id}
              onClick={() => router.push(`/Vehiculos/${v.id}`)}
              style={{
                backgroundColor: "#0d0d0d", borderRadius: "18px",
                border: "1px solid #1a1a1a", overflow: "hidden",
                transition: "transform 0.2s, border-color 0.2s",
                cursor: "pointer",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = "#3b82f6"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "#1a1a1a"; }}
            >
              {/* ── Imagen principal del vehículo ── */}
              <div style={{
                height: "170px", backgroundColor: "#111",
                display: "flex", justifyContent: "center", alignItems: "center",
                overflow: "hidden",
                backgroundImage: "radial-gradient(circle at 50% 50%, #1a1a2e 0%, #0d0d0d 100%)"
              }}>
                {v.imagenes && v.imagenes.length > 0 ? (
                  <img
                    src={v.imagenes[0]}
                    alt={`${v.marca} ${v.modelo}`}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <span style={{ fontSize: "4rem" }}>🚗</span>
                )}
              </div>

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
                    onClick={() => handleComprar(v)}
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
                    onClick={() => router.push(`/Vehiculos/${v.id}`)}
                    style={{ flex: 1, padding: "10px", backgroundColor: "#1a1a1a", border: "1px solid #222", color: "#fff", borderRadius: "10px", cursor: "pointer", fontSize: "0.8rem" }}
                  >
                    Ver más
                  </button>
                  <button
                    onClick={() => handleFavorito(v.id)}
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

      {compraPendiente && (
        <div className="iauto-modal" style={{
          position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.72)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "1rem", zIndex: 500
        }}>
          <div className="iauto-modal-panel" style={{
            width: "min(520px, 100%)", backgroundColor: "#0d0d0d",
            border: "1px solid #222", borderRadius: "18px", padding: "1.5rem",
            boxShadow: "0 20px 80px rgba(0,0,0,0.55)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "flex-start", marginBottom: "1rem" }}>
              <div>
                <p style={{ color: "#3b82f6", margin: "0 0 0.25rem", fontSize: "0.75rem", fontWeight: "800", textTransform: "uppercase" }}>Resumen de compra</p>
                <h3 style={{ margin: 0, fontSize: "1.35rem" }}>{compraPendiente.marca} {compraPendiente.modelo}</h3>
              </div>
              <button onClick={() => setCompraPendiente(null)} style={{ background: "none", border: "1px solid #333", color: "#aaa", borderRadius: "8px", width: "34px", height: "34px", cursor: "pointer" }}>x</button>
            </div>

            <label style={{ display: "flex", justifyContent: "space-between", gap: "1rem", padding: "0.8rem 0", borderTop: "1px solid #1a1a1a", color: "#ddd" }}>
              <span>Solicitar subvención estimada</span>
              <input type="checkbox" checked={compraOpciones.subvencion} onChange={(e) => setCompraOpciones({ ...compraOpciones, subvencion: e.target.checked })} />
            </label>

            <div style={{ padding: "0.8rem 0", borderTop: "1px solid #1a1a1a" }}>
              <p style={{ color: "#777", margin: "0 0 0.5rem", fontSize: "0.8rem", textTransform: "uppercase" }}>Seguro</p>
              <select value={compraOpciones.seguro} onChange={(e) => setCompraOpciones({ ...compraOpciones, seguro: e.target.value })} style={{ width: "100%", backgroundColor: "#111", color: "#fff", border: "1px solid #222", borderRadius: "10px", padding: "10px" }}>
                <option value="todo-riesgo">Todo riesgo - 690 EUR/año</option>
                <option value="terceros">Terceros ampliado - 290 EUR/año</option>
                <option value="sin-seguro">Lo contrataré por mi cuenta</option>
              </select>
            </div>

            <label style={{ display: "flex", justifyContent: "space-between", gap: "1rem", padding: "0.8rem 0", borderTop: "1px solid #1a1a1a", color: "#ddd" }}>
              <span>Financiación con estudio previo</span>
              <input type="checkbox" checked={compraOpciones.financiacion} onChange={(e) => setCompraOpciones({ ...compraOpciones, financiacion: e.target.checked })} />
            </label>
            <label style={{ display: "flex", justifyContent: "space-between", gap: "1rem", padding: "0.8rem 0", borderTop: "1px solid #1a1a1a", color: "#ddd" }}>
              <span>Garantía ampliada 24 meses (+450 EUR)</span>
              <input type="checkbox" checked={compraOpciones.garantia} onChange={(e) => setCompraOpciones({ ...compraOpciones, garantia: e.target.checked })} />
            </label>

            <div style={{ padding: "0.8rem 0", borderTop: "1px solid #1a1a1a" }}>
              <p style={{ color: "#777", margin: "0 0 0.5rem", fontSize: "0.8rem", textTransform: "uppercase" }}>Entrega</p>
              <select value={compraOpciones.entrega} onChange={(e) => setCompraOpciones({ ...compraOpciones, entrega: e.target.value })} style={{ width: "100%", backgroundColor: "#111", color: "#fff", border: "1px solid #222", borderRadius: "10px", padding: "10px" }}>
                <option value="concesionario">Recogida en concesionario</option>
                <option value="domicilio">Entrega a domicilio (+180 EUR)</option>
              </select>
            </div>

            <div style={{ backgroundColor: "#111", border: "1px solid #222", borderRadius: "12px", padding: "1rem", margin: "0.75rem 0 1rem" }}>
              <p style={{ display: "flex", justifyContent: "space-between", margin: "0 0 0.45rem", color: "#aaa" }}><span>Vehículo</span><strong>{compraPendiente.precio?.toLocaleString()} EUR</strong></p>
              <p style={{ display: "flex", justifyContent: "space-between", margin: "0 0 0.45rem", color: "#aaa" }}><span>Extras y seguro</span><strong>{extrasCompra.toLocaleString()} EUR</strong></p>
              <p style={{ display: "flex", justifyContent: "space-between", margin: "0 0 0.75rem", color: "#10b981" }}><span>Subvención estimada</span><strong>-{descuentoSubvencion.toLocaleString()} EUR</strong></p>
              <p style={{ display: "flex", justifyContent: "space-between", margin: 0, color: "#fff", fontSize: "1.1rem" }}><span>Total estimado</span><strong>{totalEstimado.toLocaleString()} EUR</strong></p>
            </div>

            <div className="iauto-actions" style={{ display: "flex", gap: "0.75rem" }}>
              <button onClick={() => setCompraPendiente(null)} style={{ flex: 1, padding: "12px", backgroundColor: "#111", color: "#aaa", border: "1px solid #222", borderRadius: "12px", cursor: "pointer", fontWeight: "700" }}>Cancelar</button>
              <button onClick={confirmarCompra} disabled={comprando} style={{ flex: 2, padding: "12px", backgroundColor: "#fff", color: "#000", border: "none", borderRadius: "12px", cursor: comprando ? "not-allowed" : "pointer", fontWeight: "800" }}>
                {comprando ? "Registrando..." : "Confirmar compra"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

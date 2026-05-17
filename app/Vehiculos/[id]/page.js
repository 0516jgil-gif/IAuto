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
  const [mostrarCompra, setMostrarCompra] = useState(false);
  const [compraOpciones, setCompraOpciones] = useState({
    subvencion: true,
    seguro: "todo-riesgo",
    financiacion: false,
    garantia: true,
    entrega: "concesionario",
  });
  const [comprando, setComprando] = useState(false);
  const [imagenActiva, setImagenActiva] = useState(0); // índice de la imagen seleccionada

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const lastActivity = localStorage.getItem("lastActivity");
    const rol = localStorage.getItem("userRol");
    const adminName = localStorage.getItem("userName");
    const ahora = new Date().getTime();

    if (userId && lastActivity && ahora - parseInt(lastActivity) < 30 * 60 * 1000) {
      localStorage.setItem("lastActivity", ahora.toString());
      Promise.resolve().then(() => {
        setIsLogged(true);
        if (["admin", "trabajador", "administrador"].includes(rol)) {
          setIsAdmin(true);
          setUserName(adminName || "Trabajador");
        } else {
          fetch("/api/Clientes")
            .then((r) => r.json())
            .then((data) => {
              const user = data.find((c) => c.id === parseInt(userId));
              if (user) setUserName(user.nombre);
            });
        }
      });
    }

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

  const validarCliente = (accion) => {
    if (!isLogged || ["admin", "trabajador", "administrador"].includes(localStorage.getItem("userRol"))) {
      alert(`Para ${accion} debes iniciar sesión como cliente.`);
      router.push("/login");
      return null;
    }
    return Number(localStorage.getItem("userId"));
  };

  const handleComprar = () => {
    const clienteId = validarCliente("comprar este vehículo");
    if (!clienteId || !vehiculo) return;
    setMostrarCompra(true);
  };

  const confirmarCompra = async () => {
    if (!vehiculo) return;
    const clienteId = Number(localStorage.getItem("userId"));
    setComprando(true);

    const res = await fetch("/api/ventas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clienteId, vehiculoId: vehiculo.id, cantidad: 1, total: totalEstimado }),
    });
    const data = await res.json();
    setComprando(false);

    if (!res.ok) {
      alert(data.error || "No se pudo registrar la compra.");
      return;
    }

    setVehiculo((actual) => actual ? { ...actual, stock: Math.max(actual.stock - 1, 0) } : actual);
    setMostrarCompra(false);
    alert("Compra registrada correctamente. Ya aparece en tu perfil.");
  };

  const handleFavorito = async () => {
    const clienteId = validarCliente("guardar en favoritos");
    if (!clienteId || !vehiculo) return;

    const res = await fetch("/api/favoritos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clienteId, vehiculoId: vehiculo.id }),
    });
    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "No se pudo guardar el favorito.");
      return;
    }

    alert("Vehículo guardado en favoritos. Ya aparece en tu perfil.");
  };

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
          <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🚗</div>
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
  const imagenes = Array.isArray(vehiculo.imagenes) && vehiculo.imagenes.length > 0
    ? vehiculo.imagenes
    : null;

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

  const seguroPrecio = compraOpciones.seguro === "todo-riesgo" ? 690 : compraOpciones.seguro === "terceros" ? 290 : 0;
  const extrasCompra =
    seguroPrecio +
    (compraOpciones.garantia ? 450 : 0) +
    (compraOpciones.entrega === "domicilio" ? 180 : 0);
  const descuentoSubvencion = compraOpciones.subvencion ? 1200 : 0;
  const totalEstimado = Math.max((vehiculo?.precio || 0) + extrasCompra - descuentoSubvencion, 0);

  return (
    <div style={{ backgroundColor: "#000", minHeight: "100vh", color: "#fff", fontFamily: "sans-serif" }}>

      {/* HEADER */}
      <header style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "1.2rem 4rem", borderBottom: "1px solid #111",
        position: "sticky", top: 0, backgroundColor: "rgba(0,0,0,0.95)",
        backdropFilter: "blur(12px)", zIndex: 100,
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

        <div className="iauto-detail-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2.5rem" }}>

          {/* ── Columna izquierda: galería de imágenes ── */}
          <div>
            {/* Imagen principal */}
            <div className="iauto-detail-image" style={{
              height: "360px", borderRadius: "20px",
              border: "1px solid #1a1a1a", backgroundColor: "#111",
              overflow: "hidden", marginBottom: "0.75rem",
              display: "flex", alignItems: "center", justifyContent: "center",
              backgroundImage: !imagenes
                ? "radial-gradient(circle at 50% 45%, #1e3a8a 0%, #111827 36%, #050505 100%)"
                : "none",
            }}>
              {imagenes ? (
                <img
                  src={imagenes[imagenActiva]}
                  alt={`${vehiculo.marca} ${vehiculo.modelo} - foto ${imagenActiva + 1}`}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <span style={{ fontSize: "6rem" }}>🚗</span>
              )}
            </div>

            {/* Miniaturas — solo si hay más de 1 imagen */}
            {imagenes && imagenes.length > 1 && (
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                {imagenes.map((url, i) => (
                  <div
                    key={i}
                    onClick={() => setImagenActiva(i)}
                    style={{
                      width: "72px", height: "52px", borderRadius: "8px",
                      overflow: "hidden", cursor: "pointer", flexShrink: 0,
                      border: i === imagenActiva
                        ? "2px solid #3b82f6"
                        : "2px solid #1a1a1a",
                      transition: "border-color 0.15s",
                    }}
                  >
                    <img
                      src={url}
                      alt={`miniatura ${i + 1}`}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Contador de fotos */}
            {imagenes && imagenes.length > 1 && (
              <p style={{ color: "#555", fontSize: "0.78rem", margin: "0 0 1rem" }}>
                Foto {imagenActiva + 1} de {imagenes.length}
              </p>
            )}

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
            <div className="iauto-actions" style={{ display: "flex", gap: "0.75rem" }}>
              <button
                onClick={handleComprar}
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
                onClick={handleFavorito}
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

      {mostrarCompra && vehiculo && (
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
                <h3 style={{ margin: 0, fontSize: "1.35rem" }}>{vehiculo.marca} {vehiculo.modelo}</h3>
              </div>
              <button onClick={() => setMostrarCompra(false)} style={{ background: "none", border: "1px solid #333", color: "#aaa", borderRadius: "8px", width: "34px", height: "34px", cursor: "pointer" }}>x</button>
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
              <p style={{ display: "flex", justifyContent: "space-between", margin: "0 0 0.45rem", color: "#aaa" }}><span>Vehículo</span><strong>{vehiculo.precio?.toLocaleString()} EUR</strong></p>
              <p style={{ display: "flex", justifyContent: "space-between", margin: "0 0 0.45rem", color: "#aaa" }}><span>Extras y seguro</span><strong>{extrasCompra.toLocaleString()} EUR</strong></p>
              <p style={{ display: "flex", justifyContent: "space-between", margin: "0 0 0.75rem", color: "#10b981" }}><span>Subvención estimada</span><strong>-{descuentoSubvencion.toLocaleString()} EUR</strong></p>
              <p style={{ display: "flex", justifyContent: "space-between", margin: 0, color: "#fff", fontSize: "1.1rem" }}><span>Total estimado</span><strong>{totalEstimado.toLocaleString()} EUR</strong></p>
            </div>

            <div className="iauto-actions" style={{ display: "flex", gap: "0.75rem" }}>
              <button onClick={() => setMostrarCompra(false)} style={{ flex: 1, padding: "12px", backgroundColor: "#111", color: "#aaa", border: "1px solid #222", borderRadius: "12px", cursor: "pointer", fontWeight: "700" }}>Cancelar</button>
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

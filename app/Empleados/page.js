"use client";
import { useEffect, useState } from "react";

export default function PanelAdmin() {
  const [data, setData] = useState({ clientes: [], vehiculos: [], ventas: [] });
  const [loading, setLoading] = useState(true);
  const [adminName, setAdminName] = useState("");
  const [tab, setTab] = useState("clientes");
  const [editingItem, setEditingItem] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editSaving, setEditSaving] = useState(false);

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
      fetch("/api/ventas").then(r => r.json()),
    ]).then(([clientes, vehiculos, ventas]) => {
      setData({ clientes, vehiculos, ventas });
      setLoading(false);
    });
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const buttonActionStyle = (type) => {
    const colors = {
      ok: { background: "#064e3b", color: "#10b981" },
      edit: { background: "#172554", color: "#60a5fa" },
      no: { background: "#450a0a", color: "#ef4444" },
    };
    const selected = colors[type] || colors.no;

    return {
    backgroundColor: selected.background,
    color: selected.color,
    border: `1px solid ${selected.color}`,
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
    fontSize: "1rem",
    lineHeight: 1,
    padding: 0,
    };
  };

  const handleEditarCliente = (cliente) => {
    setEditingItem({ type: "cliente", id: cliente.id });
    setEditForm({
      nombre: cliente.nombre || "",
      email: cliente.email || "",
      telefono: cliente.telefono || "",
    });
  };

  const handleEditarVehiculo = (vehiculo) => {
    setEditingItem({ type: "vehiculo", id: vehiculo.id });
    setEditForm({
      marca: vehiculo.marca || "",
      modelo: vehiculo.modelo || "",
      precio: String(vehiculo.precio ?? ""),
      stock: String(vehiculo.stock ?? ""),
    });
  };

  const handleCancelarEdicion = () => {
    setEditingItem(null);
    setEditForm({});
    setEditSaving(false);
  };

  const handleGuardarEdicion = async (e) => {
    e.preventDefault();

    if (!editingItem) return;

    const isCliente = editingItem.type === "cliente";
    const url = isCliente ? `/api/Clientes?id=${editingItem.id}` : `/api/Vehiculos?id=${editingItem.id}`;
    const payload = isCliente
      ? {
          nombre: editForm.nombre.trim(),
          email: editForm.email.trim(),
          telefono: editForm.telefono.trim(),
        }
      : {
          marca: editForm.marca.trim(),
          modelo: editForm.modelo.trim(),
          precio: Number(editForm.precio),
          stock: Number(editForm.stock),
        };

    if (isCliente && (!payload.nombre || !payload.email || !payload.telefono)) {
      alert("Completa nombre, email y teléfono.");
      return;
    }

    if (!isCliente && (!payload.marca || !payload.modelo || Number.isNaN(payload.precio) || Number.isNaN(payload.stock))) {
      alert("Completa marca, modelo, precio y stock con datos válidos.");
      return;
    }

    setEditSaving(true);

    try {
      const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();

      if (!res.ok) {
        alert(result.error || "No se pudo guardar la edición.");
        setEditSaving(false);
        return;
      }

      setData(prev => ({
        ...prev,
        clientes: isCliente
          ? prev.clientes.map(c => c.id === editingItem.id ? result : c)
          : prev.clientes,
        vehiculos: isCliente
          ? prev.vehiculos
          : prev.vehiculos.map(v => v.id === editingItem.id ? result : v),
      }));
      handleCancelarEdicion();
      alert(isCliente ? "El cliente se ha editado correctamente." : "El vehículo se ha editado correctamente.");
    } catch (error) {
      alert(isCliente ? "Error al editar el cliente." : "Error al editar el vehículo.");
      setEditSaving(false);
    }
  };

  const handleDenegarCliente = async (cliente) => {
    const confirmar = window.confirm(`¿Quieres denegar al cliente #${cliente.id}?`);

    if (!confirmar) return;

    try {
      const res = await fetch(`/api/Clientes?id=${cliente.id}`, {
        method: "DELETE",
      });
      const result = await res.json();

      if (!res.ok) {
        alert(result.error || "No se pudo eliminar el cliente.");
        return;
      }

      setData(prev => ({
        ...prev,
        clientes: prev.clientes.filter(c => c.id !== cliente.id),
      }));
      alert("El cliente se ha eliminado correctamente.");
    } catch (error) {
      alert("Error al eliminar el cliente.");
    }
  };

  const handleDenegarVehiculo = async (vehiculo) => {
    const confirmar = window.confirm(`¿Quieres denegar el vehículo #${vehiculo.id}?`);

    if (!confirmar) return;

    try {
      const res = await fetch(`/api/Vehiculos?id=${vehiculo.id}`, {
        method: "DELETE",
      });
      const result = await res.json();

      if (!res.ok) {
        alert(result.error || "No se pudo eliminar el vehículo.");
        return;
      }

      setData(prev => ({
        ...prev,
        vehiculos: prev.vehiculos.filter(v => v.id !== vehiculo.id),
      }));
      alert("El vehículo se ha eliminado correctamente.");
    } catch (error) {
      alert("Error al eliminar el vehículo.");
    }
  };

  const handleProcesarVenta = (venta) => {
    const confirmar = window.confirm(`¿Quieres procesar la venta #${venta.id}?`);

    if (confirmar) {
      alert("La venta se ha procesado correctamente.");
    }
  };

  const handleDenegarVenta = async (venta) => {
    const confirmar = window.confirm(`¿Quieres denegar la venta #${venta.id}?`);

    if (!confirmar) return;

    try {
      const res = await fetch(`/api/ventas?id=${venta.id}`, {
        method: "DELETE",
      });
      const result = await res.json();

      if (!res.ok) {
        alert(result.error || "No se pudo eliminar la venta.");
        return;
      }

      setData(prev => ({
        ...prev,
        ventas: prev.ventas.filter(v => v.id !== venta.id),
        vehiculos: prev.vehiculos.map(vehiculo =>
          vehiculo.id === venta.vehiculoId
            ? { ...vehiculo, stock: vehiculo.stock + venta.cantidad }
            : vehiculo
        ),
      }));
      alert("La venta se ha eliminado correctamente.");
    } catch (error) {
      alert("Error al eliminar la venta.");
    }
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
    padding: "10px 20px",
    border: "none",
    cursor: "pointer",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "0.9rem",
    transition: "0.2s",
    backgroundColor: active ? "#3b82f6" : "#1a1a1a",
    color: active ? "#fff" : "#666",
  });

  const statCards = [
    { label: "Clientes", value: data.clientes.length, icon: "👥", color: "#3b82f6" },
    { label: "Vehículos", value: data.vehiculos.length, icon: "🚗", color: "#10b981" },
    { label: "Ventas", value: data.ventas.length, icon: "💰", color: "#f59e0b" },
    {
      label: "Ingresos",
      value: data.ventas.reduce((s, v) => s + (v.total || 0), 0).toLocaleString() + " €",
      icon: "📈",
      color: "#8b5cf6",
    },
  ];

  return (
    <div style={{ backgroundColor: "#050505", minHeight: "100vh", color: "#fff", fontFamily: "sans-serif" }}>
      <header style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem 3rem",
        backgroundColor: "#0d0d0d",
        borderBottom: "1px solid #1a1a1a",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span style={{ fontSize: "1.4rem", fontWeight: "800", color: "#3b82f6", letterSpacing: "1px" }}>IAUTO</span>
          <span style={{ color: "#333" }}>|</span>
          <span style={{ color: "#7c3aed", fontWeight: "600", fontSize: "0.9rem" }}>🔒 Panel Admin</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <span style={{ color: "#aaa", fontSize: "0.9rem" }}>
            Hola, <strong style={{ color: "#fff" }}>{adminName}</strong>
          </span>

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
        <h1 style={{ fontSize: "1.8rem", fontWeight: "700", marginBottom: "0.3rem" }}>
          Panel de Administración
        </h1>

        <p style={{ color: "#555", marginBottom: "2.5rem", fontSize: "0.9rem" }}>
          Gestión completa de la plataforma IAuto
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
          {statCards.map(({ label, value, icon, color }) => (
            <div key={label} style={{
              backgroundColor: "#111",
              borderRadius: "16px",
              padding: "1.5rem",
              border: "1px solid #1f1f1f",
              position: "relative",
              overflow: "hidden",
            }}>
              <div style={{ position: "absolute", top: "-10px", right: "-10px", fontSize: "4rem", opacity: 0.06 }}>
                {icon}
              </div>

              <div style={{ fontSize: "1.8rem", marginBottom: "0.3rem" }}>{icon}</div>

              <p style={{ color: "#666", fontSize: "0.8rem", marginBottom: "0.3rem", textTransform: "uppercase", letterSpacing: "1px" }}>
                {label}
              </p>

              <p style={{ fontSize: "2rem", fontWeight: "800", color, margin: 0 }}>
                {value}
              </p>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
          {["clientes", "vehiculos", "ventas"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={tabStyle(tab === t)}>
              {t === "clientes" ? "👥 Clientes" : t === "vehiculos" ? "🚗 Vehículos" : "💰 Ventas"}
            </button>
          ))}
        </div>

        {tab === "clientes" && (
          <div style={{ backgroundColor: "#0d0d0d", borderRadius: "16px", border: "1px solid #1a1a1a", overflow: "hidden" }}>
            <div style={{ padding: "1.2rem 1.5rem", borderBottom: "1px solid #1a1a1a" }}>
              <h3 style={{ margin: 0, fontSize: "1rem" }}>
                Lista de Clientes ({data.clientes.length})
              </h3>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ backgroundColor: "#111" }}>
                    {["ID", "Nombre", "Email", "Teléfono", "Acción"].map(h => (
                      <th key={h} style={{ padding: "1rem 1.5rem", textAlign: "left", color: "#555", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "1px" }}>
                        {h}
                      </th>
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
                      <td style={{ padding: "1rem 1.5rem" }}>
                        <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
                          <button
                            onClick={() => handleEditarCliente(c)}
                            title="Editar cliente"
                            style={buttonActionStyle("edit")}
                          >
                            ✎
                          </button>

                          <button
                            onClick={() => handleDenegarCliente(c)}
                            title="Denegar cliente"
                            style={buttonActionStyle("no")}
                          >
                            X
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "vehiculos" && (
          <div style={{ backgroundColor: "#0d0d0d", borderRadius: "16px", border: "1px solid #1a1a1a", overflow: "hidden" }}>
            <div style={{ padding: "1.2rem 1.5rem", borderBottom: "1px solid #1a1a1a" }}>
              <h3 style={{ margin: 0, fontSize: "1rem" }}>
                Inventario de Vehículos ({data.vehiculos.length})
              </h3>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ backgroundColor: "#111" }}>
                    {["ID", "Marca", "Modelo", "Precio", "Stock", "Acción"].map(h => (
                      <th key={h} style={{ padding: "1rem 1.5rem", textAlign: "left", color: "#555", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "1px" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {data.vehiculos.map((v, i) => (
                    <tr key={v.id} style={{ borderTop: "1px solid #151515", backgroundColor: i % 2 === 0 ? "transparent" : "#0a0a0a" }}>
                      <td style={{ padding: "1rem 1.5rem", color: "#555", fontSize: "0.85rem" }}>#{v.id}</td>
                      <td style={{ padding: "1rem 1.5rem", fontWeight: "600" }}>{v.marca}</td>
                      <td style={{ padding: "1rem 1.5rem", color: "#aaa" }}>{v.modelo}</td>
                      <td style={{ padding: "1rem 1.5rem", color: "#10b981", fontWeight: "600" }}>
                        {v.precio?.toLocaleString()} €
                      </td>
                      <td style={{ padding: "1rem 1.5rem" }}>
                        <span style={{
                          backgroundColor: v.stock > 0 ? "#064e3b" : "#450a0a",
                          color: v.stock > 0 ? "#10b981" : "#ef4444",
                          padding: "3px 10px",
                          borderRadius: "20px",
                          fontSize: "0.8rem",
                          fontWeight: "600",
                        }}>
                          {v.stock > 0 ? v.stock + " uds." : "Agotado"}
                        </span>
                      </td>
                      <td style={{ padding: "1rem 1.5rem" }}>
                        <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
                          <button
                            onClick={() => handleEditarVehiculo(v)}
                            title="Editar vehículo"
                            style={buttonActionStyle("edit")}
                          >
                            ✎
                          </button>

                          <button
                            onClick={() => handleDenegarVehiculo(v)}
                            title="Denegar vehículo"
                            style={buttonActionStyle("no")}
                          >
                            X
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "ventas" && (
          <div style={{ backgroundColor: "#0d0d0d", borderRadius: "16px", border: "1px solid #1a1a1a", overflow: "hidden" }}>
            <div style={{ padding: "1.2rem 1.5rem", borderBottom: "1px solid #1a1a1a" }}>
              <h3 style={{ margin: 0, fontSize: "1rem" }}>
                Registro de Ventas ({data.ventas.length})
              </h3>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ backgroundColor: "#111" }}>
                    {["ID", "Cliente", "Empleado", "Vehículo", "Cant.", "Total", "Fecha", "Acción"].map(h => (
                      <th key={h} style={{ padding: "1rem 1.5rem", textAlign: "left", color: "#555", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "1px" }}>
                        {h}
                      </th>
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
                      <td style={{ padding: "1rem 1.5rem", color: "#f59e0b", fontWeight: "600" }}>
                        {v.total?.toLocaleString()} €
                      </td>
                      <td style={{ padding: "1rem 1.5rem", color: "#555", fontSize: "0.85rem" }}>
                        {v.fecha ? new Date(v.fecha).toLocaleDateString("es-ES") : "-"}
                      </td>
                      <td style={{ padding: "1rem 1.5rem" }}>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <button
                            onClick={() => handleProcesarVenta(v)}
                            title="Procesar venta"
                            style={buttonActionStyle("ok")}
                          >
                            ✓
                          </button>

                          <button
                            onClick={() => handleDenegarVenta(v)}
                            title="Denegar venta"
                            style={buttonActionStyle("no")}
                          >
                            X
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {editingItem && (
        <div style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.72)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "1rem",
          zIndex: 1000,
        }}>
          <form
            onSubmit={handleGuardarEdicion}
            style={{
              width: "100%",
              maxWidth: "460px",
              backgroundColor: "#0d0d0d",
              border: "1px solid #262626",
              borderRadius: "16px",
              padding: "1.5rem",
              boxShadow: "0 24px 70px rgba(0, 0, 0, 0.55)",
            }}
          >
            <h2 style={{ margin: "0 0 1rem", fontSize: "1.2rem" }}>
              {editingItem.type === "cliente" ? "Editar cliente" : "Editar vehículo"}
            </h2>

            <div style={{ display: "grid", gap: "0.9rem" }}>
              {editingItem.type === "cliente" ? (
                <>
                  <label style={{ display: "grid", gap: "0.35rem", color: "#aaa", fontSize: "0.85rem" }}>
                    Nombre
                    <input
                      value={editForm.nombre || ""}
                      onChange={(e) => setEditForm(prev => ({ ...prev, nombre: e.target.value }))}
                      style={{ backgroundColor: "#050505", border: "1px solid #333", color: "#fff", borderRadius: "8px", padding: "0.75rem" }}
                    />
                  </label>

                  <label style={{ display: "grid", gap: "0.35rem", color: "#aaa", fontSize: "0.85rem" }}>
                    Email
                    <input
                      type="email"
                      value={editForm.email || ""}
                      onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                      style={{ backgroundColor: "#050505", border: "1px solid #333", color: "#fff", borderRadius: "8px", padding: "0.75rem" }}
                    />
                  </label>

                  <label style={{ display: "grid", gap: "0.35rem", color: "#aaa", fontSize: "0.85rem" }}>
                    Teléfono
                    <input
                      value={editForm.telefono || ""}
                      onChange={(e) => setEditForm(prev => ({ ...prev, telefono: e.target.value }))}
                      style={{ backgroundColor: "#050505", border: "1px solid #333", color: "#fff", borderRadius: "8px", padding: "0.75rem" }}
                    />
                  </label>
                </>
              ) : (
                <>
                  <label style={{ display: "grid", gap: "0.35rem", color: "#aaa", fontSize: "0.85rem" }}>
                    Marca
                    <input
                      value={editForm.marca || ""}
                      onChange={(e) => setEditForm(prev => ({ ...prev, marca: e.target.value }))}
                      style={{ backgroundColor: "#050505", border: "1px solid #333", color: "#fff", borderRadius: "8px", padding: "0.75rem" }}
                    />
                  </label>

                  <label style={{ display: "grid", gap: "0.35rem", color: "#aaa", fontSize: "0.85rem" }}>
                    Modelo
                    <input
                      value={editForm.modelo || ""}
                      onChange={(e) => setEditForm(prev => ({ ...prev, modelo: e.target.value }))}
                      style={{ backgroundColor: "#050505", border: "1px solid #333", color: "#fff", borderRadius: "8px", padding: "0.75rem" }}
                    />
                  </label>

                  <label style={{ display: "grid", gap: "0.35rem", color: "#aaa", fontSize: "0.85rem" }}>
                    Precio
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={editForm.precio || ""}
                      onChange={(e) => setEditForm(prev => ({ ...prev, precio: e.target.value }))}
                      style={{ backgroundColor: "#050505", border: "1px solid #333", color: "#fff", borderRadius: "8px", padding: "0.75rem" }}
                    />
                  </label>

                  <label style={{ display: "grid", gap: "0.35rem", color: "#aaa", fontSize: "0.85rem" }}>
                    Stock
                    <input
                      type="number"
                      min="0"
                      value={editForm.stock || ""}
                      onChange={(e) => setEditForm(prev => ({ ...prev, stock: e.target.value }))}
                      style={{ backgroundColor: "#050505", border: "1px solid #333", color: "#fff", borderRadius: "8px", padding: "0.75rem" }}
                    />
                  </label>
                </>
              )}
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1.5rem" }}>
              <button
                type="button"
                onClick={handleCancelarEdicion}
                disabled={editSaving}
                style={{ background: "none", border: "1px solid #444", color: "#aaa", padding: "0.7rem 1rem", borderRadius: "8px", cursor: "pointer", fontWeight: "700" }}
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={editSaving}
                style={{ backgroundColor: "#2563eb", border: "1px solid #60a5fa", color: "#fff", padding: "0.7rem 1rem", borderRadius: "8px", cursor: "pointer", fontWeight: "700" }}
              >
                {editSaving ? "Guardando..." : "Aceptar"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

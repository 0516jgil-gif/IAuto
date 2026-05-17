"use client";
import { useEffect, useState } from "react";
import { confirmAction, showError, showSuccess, showWarning } from "@/lib/alerts";

export default function PanelAdmin() {
  const [data, setData] = useState({ clientes: [], vehiculos: [], ventas: [], empleados: [] });
  const [loading, setLoading] = useState(true);
  const [adminName, setAdminName] = useState("");
  const [adminRol, setAdminRol] = useState("trabajador");
  const [tab, setTab] = useState("clientes");
  const [editingItem, setEditingItem] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editSaving, setEditSaving] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [deleteSaving, setDeleteSaving] = useState(false);
  const [clienteSearch, setClienteSearch] = useState("");
  const [vehiculoSearch, setVehiculoSearch] = useState("");
  const [ventaInfo, setVentaInfo] = useState(null);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    const rol = localStorage.getItem("userRol");
    const nombre = localStorage.getItem("userName");
    const esTrabajador = ["admin", "trabajador", "administrador"].includes(rol);

    if (!esTrabajador) {
      window.location.href = "/login";
      return;
    }

    setAdminName(nombre || "Trabajador");
    setAdminRol(rol === "admin" ? "administrador" : rol || "trabajador");

    const cargarLista = async (url) => {
      const res = await fetch(url);
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error || `No se pudo cargar ${url}`);
      }

      return Array.isArray(data) ? data : [];
    };

    Promise.allSettled([
      cargarLista("/api/Clientes"),
      cargarLista("/api/Vehiculos"),
      cargarLista("/api/ventas"),
      cargarLista("/api/Empleados"),
    ]).then(([clientes, vehiculos, ventas, empleados]) => {
      const errores = [clientes, vehiculos, ventas, empleados]
        .filter((resultado) => resultado.status === "rejected")
        .map((resultado) => resultado.reason?.message || "Error de carga");

      setData({
        clientes: clientes.status === "fulfilled" ? clientes.value : [],
        vehiculos: vehiculos.status === "fulfilled" ? vehiculos.value : [],
        ventas: ventas.status === "fulfilled" ? ventas.value : [],
        empleados: empleados.status === "fulfilled" ? empleados.value : [],
      });
      setLoadError(errores.join(" | "));
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
      add: { background: "#064e3b", color: "#34d399" },
      info: { background: "#172554", color: "#60a5fa" },
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
      marca:       vehiculo.marca       || "",
      modelo:      vehiculo.modelo      || "",
      precio:      String(vehiculo.precio ?? ""),
      stock:       String(vehiculo.stock ?? ""),
      imagenes:    Array.isArray(vehiculo.imagenes) ? vehiculo.imagenes : [],
      anio:        vehiculo.anio        ?? "",
      combustible: vehiculo.combustible ?? "",
      potencia:    vehiculo.potencia    ?? "",
      transmision: vehiculo.transmision ?? "",
      carroceria:  vehiculo.carroceria  ?? "",
      color:       vehiculo.color       ?? "",
      kilometros:  vehiculo.kilometros  ?? "",
      puertas:     vehiculo.puertas     ?? "",
      plazas:      vehiculo.plazas      ?? "",
      descripcion: vehiculo.descripcion ?? "",
    });
  };

  const handleCrearVehiculo = () => {
    setEditingItem({ type: "vehiculoNuevo" });
    setEditForm({
      marca: "", modelo: "", precio: "", stock: "", imagenes: [],
      anio: "", combustible: "", potencia: "", transmision: "",
      carroceria: "", color: "", kilometros: "", puertas: "",
      plazas: "", descripcion: "",
    });
  };

  const handleEditarEmpleado = (empleado) => {
    setEditingItem({ type: "empleado", id: empleado.id });
    setEditForm({
      nombre: empleado.nombre || "",
      email: empleado.email || "",
      rol: empleado.rol === "administrador" ? "administrador" : "trabajador",
      password: "",
    });
  };

  const handleCrearEmpleado = () => {
    setEditingItem({ type: "empleadoNuevo" });
    setEditForm({
      nombre: "",
      email: "",
      rol: "trabajador",
      password: "",
    });
  };

  const handleCancelarEdicion = () => {
    setEditingItem(null);
    setEditForm({});
    setEditSaving(false);
    setUploadingImg(false);
  };

  const handleGuardarEdicion = async (e) => {
    e.preventDefault();

    if (!editingItem) return;

    const isCliente = editingItem.type === "cliente";
    const isEmpleado = editingItem.type === "empleado";
    const isNewEmpleado = editingItem.type === "empleadoNuevo";
    const isNewVehiculo = editingItem.type === "vehiculoNuevo";
    const url = isCliente
      ? `/api/Clientes?id=${editingItem.id}`
      : isEmpleado
        ? `/api/Empleados?id=${editingItem.id}`
        : isNewEmpleado
          ? "/api/Empleados"
      : isNewVehiculo
        ? "/api/Vehiculos"
        : `/api/Vehiculos?id=${editingItem.id}`;

    const payload = isCliente
      ? {
          nombre:   editForm.nombre.trim(),
          email:    editForm.email.trim(),
          telefono: editForm.telefono.trim(),
        }
      : (isEmpleado || isNewEmpleado)
        ? {
            nombre: editForm.nombre.trim(),
            email: editForm.email.trim(),
            rol: editForm.rol === "administrador" ? "administrador" : "trabajador",
            password: editForm.password,
          }
      : {
          marca:       editForm.marca.trim(),
          modelo:      editForm.modelo.trim(),
          precio:      Number(editForm.precio),
          stock:       Number(editForm.stock),
          imagenes:    Array.isArray(editForm.imagenes) ? editForm.imagenes : [],
          anio:        editForm.anio        ? Number(editForm.anio)        : null,
          combustible: editForm.combustible || null,
          potencia:    editForm.potencia    ? Number(editForm.potencia)    : null,
          transmision: editForm.transmision || null,
          carroceria:  editForm.carroceria  || null,
          color:       editForm.color       || null,
          kilometros:  editForm.kilometros  ? Number(editForm.kilometros)  : null,
          puertas:     editForm.puertas     ? Number(editForm.puertas)     : null,
          plazas:      editForm.plazas      ? Number(editForm.plazas)      : null,
          descripcion: editForm.descripcion || null,
        };

    if (isCliente && (!payload.nombre || !payload.email || !payload.telefono)) {
      showWarning("Completa nombre, email y teléfono.");
      return;
    }

    if ((isEmpleado || isNewEmpleado) && (!payload.nombre || !payload.email || (isNewEmpleado && !payload.password))) {
      showWarning(isNewEmpleado ? "Completa nombre, email y contraseña." : "Completa nombre y email.");
      return;
    }

    if (!isCliente && !isEmpleado && !isNewEmpleado && (!payload.marca || !payload.modelo || Number.isNaN(payload.precio) || Number.isNaN(payload.stock))) {
      showWarning("Completa marca, modelo, precio y stock con datos válidos.");
      return;
    }

    setEditSaving(true);

    try {
      const res = await fetch(url, {
        method: isNewVehiculo || isNewEmpleado ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();

      if (!res.ok) {
        showError(result.error || "No se pudo guardar la edición.");
        setEditSaving(false);
        return;
      }

      setData(prev => ({
        ...prev,
        clientes: isCliente
          ? prev.clientes.map(c => c.id === editingItem.id ? result : c)
          : prev.clientes,
        empleados: isEmpleado
          ? prev.empleados.map(e => e.id === editingItem.id ? result : e)
          : isNewEmpleado
            ? [...prev.empleados, result]
            : prev.empleados,
        vehiculos: isCliente || isEmpleado || isNewEmpleado
          ? prev.vehiculos
          : isNewVehiculo
            ? [...prev.vehiculos, result]
            : prev.vehiculos.map(v => v.id === editingItem.id ? result : v),
      }));
      handleCancelarEdicion();
      showSuccess(
        isCliente
          ? "El cliente se ha editado correctamente."
          : isNewEmpleado
            ? "El trabajador se ha añadido correctamente."
            : isEmpleado
              ? "El trabajador se ha editado correctamente."
              : isNewVehiculo
                ? "El vehículo se ha añadido correctamente."
                : "El vehículo se ha editado correctamente."
      );
    } catch (error) {
      showError(isCliente ? "Error al editar el cliente." : isEmpleado || isNewEmpleado ? "Error al guardar el trabajador." : isNewVehiculo ? "Error al añadir el vehículo." : "Error al editar el vehículo.");
      setEditSaving(false);
    }
  };

  const handleDenegarCliente = (cliente) => {
    setDeleteItem({
      type: "cliente",
      id: cliente.id,
      name: cliente.nombre || `Cliente #${cliente.id}`,
    });
  };

  const handleDenegarVehiculo = (vehiculo) => {
    setDeleteItem({
      type: "vehiculo",
      id: vehiculo.id,
      name: `${vehiculo.marca || ""} ${vehiculo.modelo || ""}`.trim() || `Vehículo #${vehiculo.id}`,
    });
  };

  const handleDenegarEmpleado = (empleado) => {
    setDeleteItem({
      type: "empleado",
      id: empleado.id,
      name: empleado.nombre || `Trabajador #${empleado.id}`,
    });
  };

  const handleDenegarVenta = (venta) => {
    setDeleteItem({
      type: "venta",
      id: venta.id,
      name: `${venta.cliente?.nombre || "Cliente"} - ${venta.vehiculo?.marca || ""} ${venta.vehiculo?.modelo || ""}`.trim(),
      venta,
    });
  };

  const handleCancelarBorrado = () => {
    setDeleteItem(null);
    setDeleteSaving(false);
  };

  const handleConfirmarBorrado = async () => {
    if (!deleteItem) return;

    const isCliente = deleteItem.type === "cliente";
    const isVehiculo = deleteItem.type === "vehiculo";
    const isEmpleado = deleteItem.type === "empleado";
    const url = isCliente
      ? `/api/Clientes?id=${deleteItem.id}`
      : isVehiculo
        ? `/api/Vehiculos?id=${deleteItem.id}`
        : isEmpleado
          ? `/api/Empleados?id=${deleteItem.id}`
          : `/api/ventas?id=${deleteItem.id}`;

    setDeleteSaving(true);

    try {
      const res = await fetch(url, { method: "DELETE" });
      const result = await res.json();

      if (!res.ok) {
        showError(result.error || "No se pudo eliminar.");
        setDeleteSaving(false);
        return;
      }

      setData(prev => ({
        ...prev,
        clientes: isCliente
          ? prev.clientes.filter(c => c.id !== deleteItem.id)
          : prev.clientes,
        empleados: isEmpleado
          ? prev.empleados.filter(e => e.id !== deleteItem.id)
          : prev.empleados,
        vehiculos: isVehiculo
          ? prev.vehiculos.filter(v => v.id !== deleteItem.id)
          : deleteItem.type === "venta" && deleteItem.venta?.estado === "pendiente"
            ? prev.vehiculos.map(vehiculo =>
                vehiculo.id === deleteItem.venta.vehiculoId
                  ? { ...vehiculo, stock: vehiculo.stock + deleteItem.venta.cantidad }
                  : vehiculo
              )
            : prev.vehiculos,
        ventas: deleteItem.type === "venta"
          ? prev.ventas.map(v => v.id === deleteItem.id ? result.venta : v)
          : prev.ventas,
      }));
      handleCancelarBorrado();
      showSuccess("Se ha eliminado correctamente.");
    } catch (error) {
      showError("Error al eliminar.");
      setDeleteSaving(false);
    }
  };

  const handleProcesarVenta = async (venta) => {
    const confirmar = await confirmAction(`¿Quieres procesar la venta #${venta.id}?`);
    if (!confirmar) return;

    try {
      const res = await fetch("/api/ventas", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: venta.id, accion: "procesar" }),
      });
      const data = await res.json();

      if (!res.ok) {
        showError(data.error || "No se pudo procesar la venta.");
        return;
      }

      setData(prev => ({
        ...prev,
        ventas: prev.ventas.map(v => v.id === venta.id ? data.venta : v),
      }));
      showSuccess("La venta se ha procesado correctamente y se ha enviado el email al cliente.");
    } catch (error) {
      showError("Error al procesar la venta.");
    }
  };

  const nombreVehiculoVenta = (venta) => `${venta.vehiculo?.marca || ""} ${venta.vehiculo?.modelo || ""}`.trim() || "Vehículo";

  const detalleVentaLinea = (label, value) => (
    <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", padding: "0.7rem 0", borderTop: "1px solid #1a1a1a" }}>
      <span style={{ color: "#777" }}>{label}</span>
      <strong style={{ color: "#fff", textAlign: "right" }}>{value || "-"}</strong>
    </div>
  );

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

  const tableHeaderStyle = (center = false) => ({
    padding: "1rem 1.5rem",
    textAlign: center ? "center" : "left",
    color: "#555",
    fontSize: "0.8rem",
    textTransform: "uppercase",
    letterSpacing: "1px",
  });

  const actionCellStyle = {
    padding: "1rem 1.5rem",
    textAlign: "center",
    verticalAlign: "middle",
  };

  const actionButtonsStyle = {
    display: "flex",
    gap: "0.5rem",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  };

  const searchInputStyle = {
    width: "100%",
    maxWidth: "320px",
    backgroundColor: "#050505",
    border: "1px solid #333",
    color: "#fff",
    borderRadius: "8px",
    padding: "0.65rem 0.85rem",
    fontSize: "0.9rem",
    outline: "none",
  };

  const inputStyle = {
    backgroundColor: "#050505",
    border: "1px solid #333",
    color: "#fff",
    borderRadius: "8px",
    padding: "0.75rem",
  };

  const labelStyle = {
    display: "grid",
    gap: "0.35rem",
    color: "#aaa",
    fontSize: "0.85rem",
  };

  const clienteSearchText = clienteSearch.trim().toLowerCase();
  const vehiculoSearchText = vehiculoSearch.trim().toLowerCase();
  const isSuperAdmin = adminRol === "administrador";

  const filteredClientes = data.clientes.filter(cliente =>
    [cliente.id, cliente.nombre, cliente.email, cliente.telefono]
      .some(value => String(value || "").toLowerCase().includes(clienteSearchText))
  );

  const filteredVehiculos = data.vehiculos.filter(vehiculo =>
    [vehiculo.id, vehiculo.marca, vehiculo.modelo, vehiculo.precio, vehiculo.stock]
      .some(value => String(value || "").toLowerCase().includes(vehiculoSearchText))
  );

  const ventasPendientes = data.ventas.filter(venta => (venta.estado || "pendiente") === "pendiente");
  const ventasRealizadas = data.ventas.filter(venta => venta.estado === "realizada");
  const ventasCanceladas = data.ventas.filter(venta => venta.estado === "cancelada");
  const empleadosTrabajadores = data.empleados.filter(empleado => empleado.rol !== "administrador");

  const statCards = [
    { label: "Clientes",   value: data.clientes.length,     icon: "👥", color: "#3b82f6" },
    { label: "Vehículos",  value: data.vehiculos.length,    icon: "🚗", color: "#10b981" },
    { label: "Trabajadores", value: empleadosTrabajadores.length, icon: "ID", color: "#a78bfa" },
    { label: "Canceladas", value: ventasCanceladas.length,  icon: "!",  color: "#ef4444" },
    { label: "Ventas",     value: ventasRealizadas.length,  icon: "💰", color: "#f59e0b" },
    {
      label: "Ingresos",
      value: ventasRealizadas.reduce((s, v) => s + (v.total || 0), 0).toLocaleString() + " €",
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
          <span className="iauto-logo" style={{ fontSize: "1.4rem", fontWeight: "800", color: "#3b82f6", letterSpacing: "1px" }}>IAUTO</span>
          <span style={{ color: "#333" }}>|</span>
          <span style={{ color: "#7c3aed", fontWeight: "600", fontSize: "0.9rem" }}>
            🔒 {isSuperAdmin ? "Panel Administrador" : "Panel Trabajador"}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <span style={{ color: "#aaa", fontSize: "0.9rem" }}>
            Hola, <strong style={{ color: "#fff" }}>{adminName}</strong>
          </span>
          <button onClick={() => window.location.href = "/"} style={{ background: "none", border: "1px solid #333", color: "#aaa", padding: "6px 16px", borderRadius: "20px", cursor: "pointer", fontSize: "0.85rem" }}>
            Ver web
          </button>
          <button onClick={handleLogout} style={{ background: "none", border: "1px solid #ef4444", color: "#ef4444", padding: "6px 16px", borderRadius: "20px", cursor: "pointer", fontSize: "0.85rem" }}>
            Salir
          </button>
        </div>
      </header>

      <main style={{ padding: "2.5rem 3rem", maxWidth: "1200px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "1.8rem", fontWeight: "700", marginBottom: "0.3rem" }}>{isSuperAdmin ? "Panel de Administración" : "Panel de Trabajo"}</h1>
        <p style={{ color: "#555", marginBottom: "2.5rem", fontSize: "0.9rem" }}>Gestión completa de la plataforma IAuto</p>

        {loadError && (
          <div style={{ backgroundColor: "#2a1608", border: "1px solid #f59e0b", color: "#fbbf24", borderRadius: "12px", padding: "0.9rem 1rem", marginBottom: "1.5rem", fontSize: "0.9rem", lineHeight: 1.5 }}>
            Algunos datos no se han podido cargar: {loadError}
          </div>
        )}

        <div className="iauto-admin-stats" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1.2rem", marginBottom: "3rem" }}>
          {statCards.map(({ label, value, icon, color }) => (
            <div key={label} style={{ backgroundColor: "#111", borderRadius: "16px", padding: "1.35rem", border: "1px solid #1f1f1f", position: "relative", overflow: "hidden", minHeight: "142px" }}>
              <div style={{ position: "absolute", top: "-12px", right: "-8px", fontSize: "4.6rem", opacity: 0.14, color, fontWeight: "900", lineHeight: 1 }}>{icon}</div>
              <div style={{ width: "34px", height: "34px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color, border: `1px solid ${color}`, backgroundColor: `${color}1a`, fontSize: "1.1rem", fontWeight: "900", marginBottom: "0.85rem" }}>{icon}</div>
              <p style={{ color: "#666", fontSize: "0.8rem", marginBottom: "0.3rem", textTransform: "uppercase", letterSpacing: "1px" }}>{label}</p>
              <p className="iauto-stat-value" style={{ fontSize: "2rem", fontWeight: "800", color, margin: 0 }}>{value}</p>
            </div>
          ))}
        </div>

        <div className="iauto-admin-tabs" style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
          {["clientes", "vehiculos", "ventas", ...(isSuperAdmin ? ["trabajadores"] : [])].map(t => (
            <button key={t} onClick={() => setTab(t)} style={tabStyle(tab === t)}>
              {t === "clientes" ? "👥 Clientes" : t === "vehiculos" ? "🚗 Vehículos" : t === "trabajadores" ? "🔐 Trabajadores" : "💰 Ventas"}
            </button>
          ))}
        </div>

        {tab === "clientes" && (
          <div style={{ backgroundColor: "#0d0d0d", borderRadius: "16px", border: "1px solid #1a1a1a", overflow: "hidden" }}>
            <div style={{ padding: "1.2rem 1.5rem", borderBottom: "1px solid #1a1a1a", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
              <h3 style={{ margin: 0, fontSize: "1rem" }}>Lista de Clientes ({filteredClientes.length})</h3>
              <input type="search" value={clienteSearch} onChange={(e) => setClienteSearch(e.target.value)} placeholder="Buscar cliente..." style={searchInputStyle} />
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ backgroundColor: "#111" }}>
                    {["ID", "Nombre", "Email", "Teléfono", "Acción"].map(h => (
                      <th key={h} style={tableHeaderStyle(h === "Acción")}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredClientes.map((c, i) => (
                    <tr key={c.id} style={{ borderTop: "1px solid #151515", backgroundColor: i % 2 === 0 ? "transparent" : "#0a0a0a" }}>
                      <td style={{ padding: "1rem 1.5rem", color: "#555", fontSize: "0.85rem" }}>#{c.id}</td>
                      <td style={{ padding: "1rem 1.5rem", fontWeight: "500" }}>{c.nombre}</td>
                      <td style={{ padding: "1rem 1.5rem", color: "#3b82f6" }}>{c.email}</td>
                      <td style={{ padding: "1rem 1.5rem", color: "#aaa" }}>{c.telefono || "No indicado"}</td>
                      <td style={actionCellStyle}>
                        <div style={actionButtonsStyle}>
                          <button onClick={() => handleEditarCliente(c)} title="Editar cliente" style={buttonActionStyle("edit")}>✎</button>
                          <button onClick={() => handleDenegarCliente(c)} title="Borrar cliente" style={buttonActionStyle("no")}>X</button>
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
            <div style={{ padding: "1.2rem 1.5rem", borderBottom: "1px solid #1a1a1a", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
              <h3 style={{ margin: 0, fontSize: "1rem" }}>Inventario de Vehículos ({filteredVehiculos.length})</h3>
              <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                <input type="search" value={vehiculoSearch} onChange={(e) => setVehiculoSearch(e.target.value)} placeholder="Buscar vehículo..." style={searchInputStyle} />
                <button onClick={handleCrearVehiculo} style={{ backgroundColor: "#064e3b", border: "1px solid #34d399", color: "#34d399", padding: "0.65rem 1rem", borderRadius: "8px", cursor: "pointer", fontWeight: "700", whiteSpace: "nowrap" }}>
                  + Añadir
                </button>
              </div>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ backgroundColor: "#111" }}>
                    {["ID", "Marca", "Modelo", "Precio", "Stock", "Acción"].map(h => (
                      <th key={h} style={tableHeaderStyle(h === "Acción")}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredVehiculos.map((v, i) => (
                    <tr key={v.id} style={{ borderTop: "1px solid #151515", backgroundColor: i % 2 === 0 ? "transparent" : "#0a0a0a" }}>
                      <td style={{ padding: "1rem 1.5rem", color: "#555", fontSize: "0.85rem" }}>#{v.id}</td>
                      <td style={{ padding: "1rem 1.5rem", fontWeight: "600" }}>{v.marca}</td>
                      <td style={{ padding: "1rem 1.5rem", color: "#aaa" }}>{v.modelo}</td>
                      <td className="iauto-currency-cell" style={{ padding: "1rem 1.5rem", color: "#10b981", fontWeight: "600" }}>{v.precio?.toLocaleString()} €</td>
                      <td style={{ padding: "1rem 1.5rem" }}>
                        <span style={{ backgroundColor: v.stock > 0 ? "#064e3b" : "#450a0a", color: v.stock > 0 ? "#10b981" : "#ef4444", padding: "3px 10px", borderRadius: "20px", fontSize: "0.8rem", fontWeight: "600" }}>
                          {v.stock > 0 ? v.stock + " uds." : "Agotado"}
                        </span>
                      </td>
                      <td style={actionCellStyle}>
                        <div style={actionButtonsStyle}>
                          <button onClick={() => handleEditarVehiculo(v)} title="Editar vehículo" style={buttonActionStyle("edit")}>✎</button>
                          <button onClick={() => handleDenegarVehiculo(v)} title="Borrar vehículo" style={buttonActionStyle("no")}>X</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "trabajadores" && isSuperAdmin && (
          <div style={{ backgroundColor: "#0d0d0d", borderRadius: "16px", border: "1px solid #1a1a1a", overflow: "hidden" }}>
            <div style={{ padding: "1.2rem 1.5rem", borderBottom: "1px solid #1a1a1a", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
              <h3 style={{ margin: 0, fontSize: "1rem" }}>Gestión de Trabajadores ({data.empleados.length})</h3>
              <button onClick={handleCrearEmpleado} style={{ backgroundColor: "#064e3b", border: "1px solid #34d399", color: "#34d399", padding: "0.65rem 1rem", borderRadius: "8px", cursor: "pointer", fontWeight: "700", whiteSpace: "nowrap" }}>
                + Añadir trabajador
              </button>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ backgroundColor: "#111" }}>
                    {["ID", "Nombre", "Email", "Rol", "Acción"].map(h => (
                      <th key={h} style={tableHeaderStyle(h === "Acción")}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.empleados.map((empleado, i) => (
                    <tr key={empleado.id} style={{ borderTop: "1px solid #151515", backgroundColor: i % 2 === 0 ? "transparent" : "#0a0a0a" }}>
                      <td style={{ padding: "1rem 1.5rem", color: "#555", fontSize: "0.85rem" }}>#{empleado.id}</td>
                      <td style={{ padding: "1rem 1.5rem", fontWeight: "600" }}>{empleado.nombre}</td>
                      <td style={{ padding: "1rem 1.5rem", color: "#3b82f6" }}>{empleado.email}</td>
                      <td style={{ padding: "1rem 1.5rem", color: empleado.rol === "administrador" ? "#a78bfa" : "#10b981", fontWeight: "800" }}>
                        {empleado.rol === "administrador" ? "Administrador" : "Trabajador"}
                      </td>
                      <td style={actionCellStyle}>
                        <div style={actionButtonsStyle}>
                          <button onClick={() => handleEditarEmpleado(empleado)} title="Editar trabajador" style={buttonActionStyle("edit")}>✎</button>
                          <button onClick={() => handleDenegarEmpleado(empleado)} title="Borrar trabajador" style={buttonActionStyle("no")}>X</button>
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
              <h3 style={{ margin: 0, fontSize: "1rem" }}>Registro de Ventas Pendientes ({ventasPendientes.length})</h3>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ backgroundColor: "#111" }}>
                    {["ID", "Cliente", "Empleado", "Vehículo", "Cant.", "Total", "Fecha", "Acción"].map(h => (
                      <th key={h} style={tableHeaderStyle(h === "Acción")}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ventasPendientes.map((v, i) => (
                    <tr key={v.id} style={{ borderTop: "1px solid #151515", backgroundColor: i % 2 === 0 ? "transparent" : "#0a0a0a" }}>
                      <td style={{ padding: "1rem 1.5rem", color: "#555", fontSize: "0.85rem" }}>#{v.id}</td>
                      <td style={{ padding: "1rem 1.5rem" }}>{v.cliente?.nombre}</td>
                      <td style={{ padding: "1rem 1.5rem", color: "#aaa" }}>{v.empleado?.nombre}</td>
                      <td style={{ padding: "1rem 1.5rem" }}>{v.vehiculo?.marca} {v.vehiculo?.modelo}</td>
                      <td style={{ padding: "1rem 1.5rem", textAlign: "center" }}>{v.cantidad}</td>
                      <td className="iauto-currency-cell" style={{ padding: "1rem 1.5rem", color: "#f59e0b", fontWeight: "600" }}>{v.total?.toLocaleString()} €</td>
                      <td style={{ padding: "1rem 1.5rem", color: "#555", fontSize: "0.85rem" }}>{v.fecha ? new Date(v.fecha).toLocaleDateString("es-ES") : "-"}</td>
                      <td style={actionCellStyle}>
                        <div style={actionButtonsStyle}>
                          <button onClick={() => setVentaInfo(v)} title="Información" style={buttonActionStyle("info")}>i</button>
                          <button onClick={() => handleProcesarVenta(v)} title="Procesar" style={buttonActionStyle("ok")}>✓</button>
                          <button onClick={() => handleDenegarVenta(v)} title="Cancelar" style={buttonActionStyle("no")}>X</button>
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
          <div style={{ backgroundColor: "#07130d", borderRadius: "16px", border: "1px solid #064e3b", overflow: "hidden", marginTop: "1.5rem" }}>
            <div style={{ padding: "1.2rem 1.5rem", borderBottom: "1px solid #064e3b", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
              <h3 style={{ margin: 0, fontSize: "1rem", color: "#10b981" }}>Ventas Realizadas ({ventasRealizadas.length})</h3>
              <span style={{ color: "#10b981", border: "1px solid #10b981", borderRadius: "999px", padding: "4px 10px", fontSize: "0.75rem", fontWeight: "800" }}>Realizadas</span>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ backgroundColor: "#052e1a" }}>
                    {["ID", "Cliente", "Empleado", "Vehículo", "Cant.", "Total", "Fecha", "Estado", "Acción"].map(h => (
                      <th key={h} style={tableHeaderStyle(h === "Acción")}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ventasRealizadas.map((v, i) => (
                    <tr key={v.id} style={{ borderTop: "1px solid #064e3b", backgroundColor: i % 2 === 0 ? "rgba(6,78,59,0.16)" : "rgba(6,78,59,0.08)" }}>
                      <td style={{ padding: "1rem 1.5rem", color: "#6ee7b7", fontSize: "0.85rem" }}>#{v.id}</td>
                      <td style={{ padding: "1rem 1.5rem" }}>{v.cliente?.nombre}</td>
                      <td style={{ padding: "1rem 1.5rem", color: "#aaa" }}>{v.empleado?.nombre}</td>
                      <td style={{ padding: "1rem 1.5rem" }}>{v.vehiculo?.marca} {v.vehiculo?.modelo}</td>
                      <td style={{ padding: "1rem 1.5rem", textAlign: "center" }}>{v.cantidad}</td>
                      <td className="iauto-currency-cell" style={{ padding: "1rem 1.5rem", color: "#10b981", fontWeight: "800" }}>{v.total?.toLocaleString()} €</td>
                      <td style={{ padding: "1rem 1.5rem", color: "#9ca3af", fontSize: "0.85rem" }}>{v.fecha ? new Date(v.fecha).toLocaleDateString("es-ES") : "-"}</td>
                      <td style={{ padding: "1rem 1.5rem" }}>
                        <span style={{ color: "#10b981", border: "1px solid #10b981", borderRadius: "999px", padding: "4px 10px", fontSize: "0.75rem", fontWeight: "800" }}>Realizada</span>
                      </td>
                      <td style={actionCellStyle}>
                        <div style={actionButtonsStyle}>
                          <button onClick={() => setVentaInfo(v)} title="Información" style={buttonActionStyle("info")}>i</button>
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
          <div style={{ backgroundColor: "#170808", borderRadius: "16px", border: "1px solid #7f1d1d", overflow: "hidden", marginTop: "1.5rem" }}>
            <div style={{ padding: "1.2rem 1.5rem", borderBottom: "1px solid #7f1d1d", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
              <h3 style={{ margin: 0, fontSize: "1rem", color: "#ef4444" }}>Ventas Canceladas ({ventasCanceladas.length})</h3>
              <span style={{ color: "#ef4444", border: "1px solid #ef4444", borderRadius: "999px", padding: "4px 10px", fontSize: "0.75rem", fontWeight: "800" }}>Canceladas</span>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ backgroundColor: "#450a0a" }}>
                    {["ID", "Cliente", "Empleado", "Vehículo", "Cant.", "Total", "Fecha", "Estado", "Acción"].map(h => (
                      <th key={h} style={tableHeaderStyle(h === "Acción")}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ventasCanceladas.map((v, i) => (
                    <tr key={v.id} style={{ borderTop: "1px solid #7f1d1d", backgroundColor: i % 2 === 0 ? "rgba(127,29,29,0.18)" : "rgba(127,29,29,0.1)" }}>
                      <td style={{ padding: "1rem 1.5rem", color: "#fca5a5", fontSize: "0.85rem" }}>#{v.id}</td>
                      <td style={{ padding: "1rem 1.5rem" }}>{v.cliente?.nombre}</td>
                      <td style={{ padding: "1rem 1.5rem", color: "#aaa" }}>{v.empleado?.nombre}</td>
                      <td style={{ padding: "1rem 1.5rem" }}>{v.vehiculo?.marca} {v.vehiculo?.modelo}</td>
                      <td style={{ padding: "1rem 1.5rem", textAlign: "center" }}>{v.cantidad}</td>
                      <td className="iauto-currency-cell" style={{ padding: "1rem 1.5rem", color: "#fca5a5", fontWeight: "800" }}>{v.total?.toLocaleString()} €</td>
                      <td style={{ padding: "1rem 1.5rem", color: "#9ca3af", fontSize: "0.85rem" }}>{v.fecha ? new Date(v.fecha).toLocaleDateString("es-ES") : "-"}</td>
                      <td style={{ padding: "1rem 1.5rem" }}>
                        <span style={{ color: "#ef4444", border: "1px solid #ef4444", borderRadius: "999px", padding: "4px 10px", fontSize: "0.75rem", fontWeight: "800" }}>Cancelada</span>
                      </td>
                      <td style={actionCellStyle}>
                        <div style={actionButtonsStyle}>
                          <button onClick={() => setVentaInfo(v)} title="Información" style={buttonActionStyle("info")}>i</button>
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

      {/* MODAL EDICIÓN */}
      {editingItem && (
        <div className="iauto-modal" style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.72)", display: "flex", justifyContent: "center", alignItems: "center", padding: "1rem", zIndex: 1000, overflowY: "auto" }}>
          <form
            onSubmit={handleGuardarEdicion}
            className="iauto-modal-panel"
            style={{ width: "100%", maxWidth: "500px", backgroundColor: "#0d0d0d", border: "1px solid #262626", borderRadius: "16px", padding: "1.5rem", boxShadow: "0 24px 70px rgba(0,0,0,0.55)", margin: "auto" }}
          >
            <h2 style={{ margin: "0 0 1rem", fontSize: "1.2rem" }}>
              {editingItem.type === "cliente" ? "Editar cliente" : editingItem.type === "empleadoNuevo" ? "Añadir trabajador" : editingItem.type === "empleado" ? "Editar trabajador" : editingItem.type === "vehiculoNuevo" ? "Añadir vehículo" : "Editar vehículo"}
            </h2>

            <div style={{ display: "grid", gap: "0.9rem" }}>
              {editingItem.type === "cliente" ? (
                <>
                  <label style={labelStyle}>
                    Nombre
                    <input value={editForm.nombre || ""} onChange={(e) => setEditForm(prev => ({ ...prev, nombre: e.target.value }))} style={inputStyle} />
                  </label>
                  <label style={labelStyle}>
                    Email
                    <input type="email" value={editForm.email || ""} onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))} style={inputStyle} />
                  </label>
                  <label style={labelStyle}>
                    Teléfono
                    <input value={editForm.telefono || ""} onChange={(e) => setEditForm(prev => ({ ...prev, telefono: e.target.value }))} style={inputStyle} />
                  </label>
                </>
              ) : editingItem.type === "empleado" || editingItem.type === "empleadoNuevo" ? (
                <>
                  <label style={labelStyle}>
                    Nombre
                    <input value={editForm.nombre || ""} onChange={(e) => setEditForm(prev => ({ ...prev, nombre: e.target.value }))} style={inputStyle} />
                  </label>
                  <label style={labelStyle}>
                    Email
                    <input type="email" value={editForm.email || ""} onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))} style={inputStyle} />
                  </label>
                  <label style={labelStyle}>
                    Rol
                    <select value={editForm.rol || "trabajador"} onChange={(e) => setEditForm(prev => ({ ...prev, rol: e.target.value }))} style={inputStyle}>
                      <option value="trabajador">Trabajador</option>
                      <option value="administrador">Administrador</option>
                    </select>
                  </label>
                  <label style={labelStyle}>
                    {editingItem.type === "empleadoNuevo" ? "Contraseña" : "Nueva contraseña (opcional)"}
                    <input type="password" value={editForm.password || ""} onChange={(e) => setEditForm(prev => ({ ...prev, password: e.target.value }))} style={inputStyle} />
                  </label>
                </>
              ) : (
                <>
                  {/* ── Campos básicos ── */}
                  <label style={labelStyle}>
                    Marca
                    <input value={editForm.marca || ""} onChange={(e) => setEditForm(prev => ({ ...prev, marca: e.target.value }))} style={inputStyle} />
                  </label>
                  <label style={labelStyle}>
                    Modelo
                    <input value={editForm.modelo || ""} onChange={(e) => setEditForm(prev => ({ ...prev, modelo: e.target.value }))} style={inputStyle} />
                  </label>
                  <label style={labelStyle}>
                    Precio (€)
                    <input type="number" step="0.01" min="0" value={editForm.precio || ""} onChange={(e) => setEditForm(prev => ({ ...prev, precio: e.target.value }))} style={inputStyle} />
                  </label>
                  <label style={labelStyle}>
                    Stock
                    <input type="number" min="0" value={editForm.stock || ""} onChange={(e) => setEditForm(prev => ({ ...prev, stock: e.target.value }))} style={inputStyle} />
                  </label>

                  {/* ── Campos nuevos de especificaciones ── */}
                  <label style={labelStyle}>
                    Año
                    <input type="number" min="1900" max="2030" placeholder="Ej: 2022" value={editForm.anio || ""} onChange={(e) => setEditForm(prev => ({ ...prev, anio: e.target.value }))} style={inputStyle} />
                  </label>
                  <label style={labelStyle}>
                    Combustible
                    <select value={editForm.combustible || ""} onChange={(e) => setEditForm(prev => ({ ...prev, combustible: e.target.value }))} style={inputStyle}>
                      <option value="">— Seleccionar —</option>
                      <option value="Gasolina">Gasolina</option>
                      <option value="Diésel">Diésel</option>
                      <option value="Híbrido">Híbrido</option>
                      <option value="Híbrido enchufable">Híbrido enchufable</option>
                      <option value="Eléctrico">Eléctrico</option>
                      <option value="GLP">GLP</option>
                    </select>
                  </label>
                  <label style={labelStyle}>
                    Potencia (CV)
                    <input type="number" min="0" placeholder="Ej: 150" value={editForm.potencia || ""} onChange={(e) => setEditForm(prev => ({ ...prev, potencia: e.target.value }))} style={inputStyle} />
                  </label>
                  <label style={labelStyle}>
                    Transmisión
                    <select value={editForm.transmision || ""} onChange={(e) => setEditForm(prev => ({ ...prev, transmision: e.target.value }))} style={inputStyle}>
                      <option value="">— Seleccionar —</option>
                      <option value="Manual">Manual</option>
                      <option value="Automático">Automático</option>
                      <option value="Semiautomático">Semiautomático</option>
                    </select>
                  </label>
                  <label style={labelStyle}>
                    Carrocería
                    <select value={editForm.carroceria || ""} onChange={(e) => setEditForm(prev => ({ ...prev, carroceria: e.target.value }))} style={inputStyle}>
                      <option value="">— Seleccionar —</option>
                      <option value="Sedán">Sedán</option>
                      <option value="SUV">SUV</option>
                      <option value="Hatchback">Hatchback</option>
                      <option value="Familiar">Familiar</option>
                      <option value="Coupé">Coupé</option>
                      <option value="Cabrio">Cabrio</option>
                      <option value="Monovolumen">Monovolumen</option>
                      <option value="Pickup">Pickup</option>
                    </select>
                  </label>
                  <label style={labelStyle}>
                    Color
                    <input placeholder="Ej: Negro, Blanco perla..." value={editForm.color || ""} onChange={(e) => setEditForm(prev => ({ ...prev, color: e.target.value }))} style={inputStyle} />
                  </label>
                  <label style={labelStyle}>
                    Kilómetros
                    <input type="number" min="0" placeholder="Ej: 45000" value={editForm.kilometros || ""} onChange={(e) => setEditForm(prev => ({ ...prev, kilometros: e.target.value }))} style={inputStyle} />
                  </label>
                  <label style={labelStyle}>
                    Puertas
                    <input type="number" min="2" max="6" placeholder="Ej: 5" value={editForm.puertas || ""} onChange={(e) => setEditForm(prev => ({ ...prev, puertas: e.target.value }))} style={inputStyle} />
                  </label>
                  <label style={labelStyle}>
                    Plazas
                    <input type="number" min="1" max="9" placeholder="Ej: 5" value={editForm.plazas || ""} onChange={(e) => setEditForm(prev => ({ ...prev, plazas: e.target.value }))} style={inputStyle} />
                  </label>
                  <label style={labelStyle}>
                    Descripción
                    <textarea rows={3} placeholder="Descripción del vehículo..." value={editForm.descripcion || ""} onChange={(e) => setEditForm(prev => ({ ...prev, descripcion: e.target.value }))} style={{ ...inputStyle, resize: "vertical" }} />
                  </label>

                  {/* ── Sección de imágenes ── */}
                  <div style={{ display: "grid", gap: "0.5rem" }}>
                    <span style={{ color: "#aaa", fontSize: "0.85rem" }}>Imágenes ({(editForm.imagenes || []).length}/5)</span>
                    {(editForm.imagenes || []).length > 0 && (
                      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                        {(editForm.imagenes || []).map((url, i) => (
                          <div key={i} style={{ position: "relative", width: "64px", height: "48px" }}>
                            <img src={url} alt={`img ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "6px", border: "1px solid #333" }} />
                            <button
                              type="button"
                              onClick={() => setEditForm(prev => ({ ...prev, imagenes: prev.imagenes.filter((_, idx) => idx !== i) }))}
                              style={{ position: "absolute", top: "-6px", right: "-6px", width: "18px", height: "18px", borderRadius: "50%", backgroundColor: "#ef4444", border: "none", color: "#fff", cursor: "pointer", fontSize: "0.65rem", fontWeight: "800", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1, padding: 0 }}
                            >✕</button>
                          </div>
                        ))}
                      </div>
                    )}
                    {(editForm.imagenes || []).length < 5 && (
                      <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", backgroundColor: "#050505", border: "1px dashed #333", borderRadius: "8px", padding: "0.75rem", cursor: uploadingImg ? "not-allowed" : "pointer", color: "#555", fontSize: "0.85rem" }}>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/gif"
                          style={{ display: "none" }}
                          disabled={uploadingImg}
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            setUploadingImg(true);
                            try {
                              const fd = new FormData();
                              fd.append("file", file);
                              const res = await fetch("/api/upload", { method: "POST", body: fd });
                              const data = await res.json();
                              if (!res.ok) { showError(data.error || "Error al subir imagen"); return; }
                              setEditForm(prev => ({ ...prev, imagenes: [...(prev.imagenes || []), data.url] }));
                            } catch {
                              showError("Error al subir imagen");
                            } finally {
                              setUploadingImg(false);
                              e.target.value = "";
                            }
                          }}
                        />
                        {uploadingImg ? "⏳ Subiendo..." : "📷 Subir imagen"}
                      </label>
                    )}
                  </div>
                </>
              )}
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1.5rem" }}>
              <button type="button" onClick={handleCancelarEdicion} disabled={editSaving} style={{ background: "none", border: "1px solid #444", color: "#aaa", padding: "0.7rem 1rem", borderRadius: "8px", cursor: "pointer", fontWeight: "700" }}>
                Cancelar
              </button>
              <button type="submit" disabled={editSaving} style={{ backgroundColor: "#2563eb", border: "1px solid #60a5fa", color: "#fff", padding: "0.7rem 1rem", borderRadius: "8px", cursor: "pointer", fontWeight: "700" }}>
                {editSaving ? "Guardando..." : "Aceptar"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL BORRADO */}
      {deleteItem && (
        <div className="iauto-modal" style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.72)", display: "flex", justifyContent: "center", alignItems: "center", padding: "1rem", zIndex: 1000 }}>
          <div className="iauto-modal-panel" style={{ width: "100%", maxWidth: "430px", backgroundColor: "#0d0d0d", border: "1px solid #7f1d1d", borderRadius: "16px", padding: "1.5rem", boxShadow: "0 24px 70px rgba(0,0,0,0.55)" }}>
            <h2 style={{ margin: "0 0 0.6rem", fontSize: "1.2rem" }}>Confirmar borrado</h2>
            <p style={{ color: "#aaa", lineHeight: 1.5, margin: "0 0 1rem" }}>
              ¿Seguro que quieres {deleteItem.type === "venta" ? "cancelar" : "borrar"} {deleteItem.type === "vehiculo" ? "el vehículo" : deleteItem.type === "cliente" ? "el cliente" : deleteItem.type === "empleado" ? "el trabajador" : "la venta"}?
            </p>
            <div style={{ backgroundColor: "#050505", border: "1px solid #262626", borderRadius: "10px", padding: "0.9rem", color: "#fff", fontWeight: "800", marginBottom: "1.2rem", textAlign: "center" }}>
              {deleteItem.name}
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
              <button type="button" onClick={handleCancelarBorrado} disabled={deleteSaving} style={{ background: "none", border: "1px solid #444", color: "#aaa", padding: "0.7rem 1rem", borderRadius: "8px", cursor: "pointer", fontWeight: "700" }}>Cancelar</button>
              <button type="button" onClick={handleConfirmarBorrado} disabled={deleteSaving} style={{ backgroundColor: "#991b1b", border: "1px solid #ef4444", color: "#fff", padding: "0.7rem 1rem", borderRadius: "8px", cursor: "pointer", fontWeight: "700" }}>
                {deleteSaving ? "Procesando..." : "Aceptar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL INFO VENTA */}
      {ventaInfo && (
        <div className="iauto-modal" style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.72)", display: "flex", justifyContent: "center", alignItems: "center", padding: "1rem", zIndex: 1000 }}>
          <div className="iauto-modal-panel" style={{ width: "100%", maxWidth: "500px", backgroundColor: "#0d0d0d", border: "1px solid #2563eb", borderRadius: "16px", padding: "1.5rem", boxShadow: "0 24px 70px rgba(0,0,0,0.55)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "flex-start", marginBottom: "1rem" }}>
              <div>
                <p style={{ color: "#60a5fa", margin: "0 0 0.25rem", fontSize: "0.75rem", fontWeight: "800", textTransform: "uppercase" }}>Información de venta</p>
                <h2 style={{ margin: 0, fontSize: "1.25rem" }}>Venta #{ventaInfo.id}</h2>
              </div>
              <button onClick={() => setVentaInfo(null)} style={{ background: "none", border: "1px solid #333", color: "#aaa", borderRadius: "8px", width: "34px", height: "34px", cursor: "pointer" }}>x</button>
            </div>
            {detalleVentaLinea("Cliente", ventaInfo.cliente?.nombre)}
            {detalleVentaLinea("Email cliente", ventaInfo.cliente?.email)}
            {detalleVentaLinea("Empleado", ventaInfo.empleado?.nombre)}
            {detalleVentaLinea("Vehículo", nombreVehiculoVenta(ventaInfo))}
            {detalleVentaLinea("Cantidad", `${ventaInfo.cantidad} unidad(es)`)}
            {detalleVentaLinea("Total", `${ventaInfo.total?.toLocaleString()} €`)}
            {detalleVentaLinea("Fecha", ventaInfo.fecha ? new Date(ventaInfo.fecha).toLocaleDateString("es-ES") : "-")}
            {detalleVentaLinea("Estado", ventaInfo.estado === "realizada" ? "Realizada" : ventaInfo.estado === "cancelada" ? "Cancelada" : "Pendiente")}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1.2rem" }}>
              <button onClick={() => setVentaInfo(null)} style={{ background: "none", border: "1px solid #444", color: "#aaa", padding: "0.7rem 1rem", borderRadius: "8px", cursor: "pointer", fontWeight: "700" }}>Cerrar</button>
              {(ventaInfo.estado || "pendiente") === "pendiente" && (
                <button onClick={() => { const venta = ventaInfo; setVentaInfo(null); handleProcesarVenta(venta); }} style={{ backgroundColor: "#064e3b", border: "1px solid #10b981", color: "#10b981", padding: "0.7rem 1rem", borderRadius: "8px", cursor: "pointer", fontWeight: "800" }}>
                  Procesar
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

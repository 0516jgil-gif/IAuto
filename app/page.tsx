import Link from "next/link";

export default function Home() {
  return (
    <div style={{ padding: "2rem", color: "#fff", textAlign: "center" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "2rem" }}>🚗 IAuto - Panel de gestión</h1>
      <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
        <Link href="/cliente" style={btnStyle}>👥 Clientes</Link>
        <Link href="/empleado" style={btnStyle}>👔 Empleados</Link>
        <Link href="/vehiculo" style={btnStyle}>🚙 Vehículos</Link>
        <Link href="/venta" style={btnStyle}>💰 Ventas</Link>
      </div>
    </div>
  );
}

const btnStyle = {
  padding: "1rem 2rem",
  background: "#222",
  color: "#fff",
  borderRadius: "8px",
  textDecoration: "none",
  fontSize: "1.2rem",
  border: "1px solid #555",
};
"use client";
import { useEffect, useState } from "react";

export default function Empleados() {
  const [empleados, setEmpleados] = useState([]);

  useEffect(() => {
    fetch("/api/Empleados").then(res => res.json()).then(setEmpleados);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    await fetch("/api/Empleados", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre: form.nombre.value,
        puesto: form.puesto.value,
      }),
    });
    form.reset();
    setEmpleados(await (await fetch("/api/Empleados")).json());
  };

  return (
    <div style={{ padding: "2rem", color: "#fff" }}>
      <h1>Empleados</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
        <input name="nombre" placeholder="Nombre" required style={{ marginRight: "0.5rem" }} />
        <input name="puesto" placeholder="Puesto" required style={{ marginRight: "0.5rem" }} />
        <button type="submit">Crear</button>
      </form>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #fff", padding: "0.5rem" }}>ID</th>
            <th style={{ border: "1px solid #fff", padding: "0.5rem" }}>Nombre</th>
            <th style={{ border: "1px solid #fff", padding: "0.5rem" }}>Puesto</th>
          </tr>
        </thead>
        <tbody>
          {empleados.map(e => (
            <tr key={e.id}>
              <td style={{ border: "1px solid #fff", padding: "0.5rem" }}>{e.id}</td>
              <td style={{ border: "1px solid #fff", padding: "0.5rem" }}>{e.nombre}</td>
              <td style={{ border: "1px solid #fff", padding: "0.5rem" }}>{e.puesto}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
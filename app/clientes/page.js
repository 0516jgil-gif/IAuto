"use client";

import { useEffect, useState } from "react";

export default function Clientes() {
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    fetch("/api/Clientes")
      .then(res => res.json())
      .then(setClientes);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    await fetch("/api/Clientes", {
      method: "POST",
      headers: {
      "Content-Type": "application/json", // <- MUY IMPORTANTE
      },
      body: JSON.stringify({
      nombre: form.nombre.value,
      email: form.email.value,
      telefono: form.telefono.value,
    }),
});

    form.reset();
    setClientes(await (await fetch("/api/Clientes")).json());
  };

  return (
    <div style={{ padding: "2rem", color: "#fff" }}>
      <h1>Clientes</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
        <input name="nombre" placeholder="Nombre" required style={{ marginRight: "0.5rem" }}/>
        <input name="email" placeholder="Email" required style={{ marginRight: "0.5rem" }}/>
        <input name="telefono" placeholder="Teléfono" required style={{ marginRight: "0.5rem" }}/>
        <button type="submit">Crear</button>
      </form>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #fff", padding: "0.5rem" }}>ID</th>
            <th style={{ border: "1px solid #fff", padding: "0.5rem" }}>Nombre</th>
            <th style={{ border: "1px solid #fff", padding: "0.5rem" }}>Email</th>
            <th style={{ border: "1px solid #fff", padding: "0.5rem" }}>Teléfono</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map(c => (
            <tr key={c.id}>
              <td style={{ border: "1px solid #fff", padding: "0.5rem" }}>{c.id}</td>
              <td style={{ border: "1px solid #fff", padding: "0.5rem" }}>{c.nombre}</td>
              <td style={{ border: "1px solid #fff", padding: "0.5rem" }}>{c.email}</td>
              <td style={{ border: "1px solid #fff", padding: "0.5rem" }}>{c.telefono}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
"use client";
import { useEffect, useState } from "react";

export default function Vehiculos() {
  const [vehiculos, setVehiculos] = useState([]);

  useEffect(() => {
    fetch("/api/Vehiculos").then(res => res.json()).then(setVehiculos);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    await fetch("/api/Vehiculos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        marca: form.marca.value,
        modelo: form.modelo.value,
        precio: parseFloat(form.precio.value),
        stock: parseInt(form.stock.value),
      }),
    });
    form.reset();
    setVehiculos(await (await fetch("/api/Vehiculos")).json());
  };

  return (
    <div style={{ padding: "2rem", color: "#fff" }}>
      <h1>Vehículos</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
        <input name="marca" placeholder="Marca" required style={{ marginRight: "0.5rem" }} />
        <input name="modelo" placeholder="Modelo" required style={{ marginRight: "0.5rem" }} />
        <input name="precio" placeholder="Precio" type="number" required style={{ marginRight: "0.5rem" }} />
        <input name="stock" placeholder="Stock" type="number" required style={{ marginRight: "0.5rem" }} />
        <button type="submit">Crear</button>
      </form>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #fff", padding: "0.5rem" }}>ID</th>
            <th style={{ border: "1px solid #fff", padding: "0.5rem" }}>Marca</th>
            <th style={{ border: "1px solid #fff", padding: "0.5rem" }}>Modelo</th>
            <th style={{ border: "1px solid #fff", padding: "0.5rem" }}>Precio</th>
            <th style={{ border: "1px solid #fff", padding: "0.5rem" }}>Stock</th>
          </tr>
        </thead>
        <tbody>
          {vehiculos.map(v => (
            <tr key={v.id}>
              <td style={{ border: "1px solid #fff", padding: "0.5rem" }}>{v.id}</td>
              <td style={{ border: "1px solid #fff", padding: "0.5rem" }}>{v.marca}</td>
              <td style={{ border: "1px solid #fff", padding: "0.5rem" }}>{v.modelo}</td>
              <td style={{ border: "1px solid #fff", padding: "0.5rem" }}>{v.precio}</td>
              <td style={{ border: "1px solid #fff", padding: "0.5rem" }}>{v.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
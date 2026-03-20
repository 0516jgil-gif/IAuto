"use client";
import { useEffect, useState } from "react";

export default function Ventas() {
  const [ventas, setVentas] = useState([]);

  useEffect(() => {
    fetch("/api/Ventas").then(res => res.json()).then(setVentas);
  }, []);

  return (
    <div style={{ padding: "2rem", color: "#fff" }}>
      <h1>Ventas</h1>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #fff", padding: "0.5rem" }}>ID</th>
            <th style={{ border: "1px solid #fff", padding: "0.5rem" }}>Cliente</th>
            <th style={{ border: "1px solid #fff", padding: "0.5rem" }}>Empleado</th>
            <th style={{ border: "1px solid #fff", padding: "0.5rem" }}>Vehículo</th>
            <th style={{ border: "1px solid #fff", padding: "0.5rem" }}>Cantidad</th>
            <th style={{ border: "1px solid #fff", padding: "0.5rem" }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {ventas.map(v => (
            <tr key={v.id}>
              <td style={{ border: "1px solid #fff", padding: "0.5rem" }}>{v.id}</td>
              <td style={{ border: "1px solid #fff", padding: "0.5rem" }}>{v.cliente?.nombre}</td>
              <td style={{ border: "1px solid #fff", padding: "0.5rem" }}>{v.empleado?.nombre}</td>
              <td style={{ border: "1px solid #fff", padding: "0.5rem" }}>{v.vehiculo?.modelo}</td>
              <td style={{ border: "1px solid #fff", padding: "0.5rem" }}>{v.cantidad}</td>
              <td style={{ border: "1px solid #fff", padding: "0.5rem" }}>{v.total}€</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (res.ok) {
      const user = await res.json();
      localStorage.setItem("userId", user.id);
      router.push("/perfil");
    } else {
      alert("Error: Email no encontrado.");
    }
  };

  return (
    <div style={{ backgroundColor: "#000", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", color: "#fff" }}>
      <form onSubmit={handleLogin} style={{ backgroundColor: "#111", padding: "2rem", borderRadius: "15px", border: "1px solid #333", width: "350px" }}>
        <h2 style={{ textAlign: "center" }}>Acceso Clientes</h2>
        <input 
          type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", padding: "10px", margin: "1rem 0", borderRadius: "5px", border: "1px solid #444", backgroundColor: "#000", color: "#fff" }}
        />
        <button type="submit" style={{ width: "100%", padding: "10px", backgroundColor: "#3b82f6", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}>Entrar</button>
      </form>
    </div>
  );
}
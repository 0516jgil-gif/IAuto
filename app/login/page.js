"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ nombre: "", email: "", telefono: "" });
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? "/api/login" : "/api/Clientes";
    const body = isLogin ? { email: formData.email } : formData;

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      const user = await res.json();
      // SESIÓN: Guardamos ID y la hora actual
      localStorage.setItem("userId", user.id);
      localStorage.setItem("lastActivity", new Date().getTime().toString());
      
      router.push("/Vehiculos");
    } else {
      alert(isLogin ? "Usuario no encontrado" : "Error al registrar");
    }
  };

  return (
    // ... (Mantén el mismo JSX que tenías antes para el formulario) ...
    <div style={{ backgroundColor: "#000", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", color: "#fff", fontFamily: "sans-serif" }}>
      <div style={{ backgroundColor: "#111", padding: "2.5rem", borderRadius: "15px", border: "1px solid #333", width: "90%", maxWidth: "400px" }}>
        <h2 style={{ textAlign: "center", color: "#3b82f6", marginBottom: "1.5rem" }}>{isLogin ? "Login IAuto" : "Registro IAuto"}</h2>
        <form onSubmit={handleSubmit}>
          {!isLogin && <input name="nombre" placeholder="Nombre" required style={inputStyle} onChange={(e) => setFormData({...formData, nombre: e.target.value})} />}
          <input type="email" name="email" placeholder="Email" required style={inputStyle} onChange={(e) => setFormData({...formData, email: e.target.value})} />
          {!isLogin && <input name="telefono" placeholder="Teléfono" required style={inputStyle} onChange={(e) => setFormData({...formData, telefono: e.target.value})} />}
          <button type="submit" style={{ width: "100%", padding: "12px", backgroundColor: "#3b82f6", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer" }}>
            {isLogin ? "Entrar" : "Crear Cuenta"}
          </button>
        </form>
        <p onClick={() => setIsLogin(!isLogin)} style={{ textAlign: "center", marginTop: "1rem", cursor: "pointer", color: "#666" }}>
          {isLogin ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Login"}
        </p>
      </div>
    </div>
  );
}

const inputStyle = { width: "100%", padding: "12px", marginBottom: "1rem", borderRadius: "8px", border: "1px solid #444", backgroundColor: "#000", color: "#fff", boxSizing: "border-box" };
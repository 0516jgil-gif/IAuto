"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true); // Estado para alternar entre Login y Registro
  const [formData, setFormData] = useState({ nombre: "", email: "", telefono: "" });
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLogin) {
      // --- LÓGICA DE LOGIN ---
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });

      if (res.ok) {
        const user = await res.json();
        localStorage.setItem("userId", user.id);
        router.push("/perfil");
      } else {
        alert("Email no encontrado. ¡Regístrate primero!");
      }
    } else {
      // --- LÓGICA DE REGISTRO ---
      const res = await fetch("/api/Clientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const newUser = await res.json();
        localStorage.setItem("userId", newUser.id); // Login automático al registrarse
        alert("¡Cuenta creada con éxito!");
        router.push("/perfil");
      } else {
        alert("Error al registrarse. Puede que el email ya exista.");
      }
    }
  };

  // Estilos rápidos
  const inputStyle = {
    width: "100%", padding: "12px", marginBottom: "1rem", borderRadius: "8px",
    border: "1px solid #444", backgroundColor: "#000", color: "#fff", boxSizing: "border-box"
  };

  return (
    <div style={{ backgroundColor: "#000", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", color: "#fff", fontFamily: "sans-serif" }}>
      <div style={{ backgroundColor: "#111", padding: "2.5rem", borderRadius: "15px", border: "1px solid #333", width: "90%", maxWidth: "400px" }}>
        
        <h2 style={{ textAlign: "center", color: "#3b82f6", marginBottom: "1.5rem" }}>
          {isLogin ? "Identifícate en IAuto" : "Crea tu cuenta IAuto"}
        </h2>

        {/* Selector de pestañas */}
        <div style={{ display: "flex", marginBottom: "2rem", borderBottom: "1px solid #333" }}>
          <button 
            onClick={() => setIsLogin(true)} 
            style={{ flex: 1, padding: "10px", background: "none", border: "none", color: isLogin ? "#3b82f6" : "#666", borderBottom: isLogin ? "2px solid #3b82f6" : "none", cursor: "pointer" }}
          >
            Login
          </button>
          <button 
            onClick={() => setIsLogin(false)} 
            style={{ flex: 1, padding: "10px", background: "none", border: "none", color: !isLogin ? "#3b82f6" : "#666", borderBottom: !isLogin ? "2px solid #3b82f6" : "none", cursor: "pointer" }}
          >
            Registro
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input name="nombre" placeholder="Nombre completo" required style={inputStyle} onChange={handleChange} />
          )}
          
          <input type="email" name="email" placeholder="Correo electrónico" required style={inputStyle} onChange={handleChange} />
          
          {!isLogin && (
            <input name="telefono" placeholder="Teléfono" required style={inputStyle} onChange={handleChange} />
          )}

          <button type="submit" style={{ width: "100%", padding: "12px", backgroundColor: "#3b82f6", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", marginTop: "1rem" }}>
            {isLogin ? "Acceder" : "Registrarme"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.85rem", color: "#666" }}>
          {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"} 
          <span 
            onClick={() => setIsLogin(!isLogin)} 
            style={{ color: "#3b82f6", cursor: "pointer", marginLeft: "5px" }}
          >
            {isLogin ? "Regístrate aquí" : "Inicia sesión"}
          </span>
        </p>
      </div>
    </div>
  );
}
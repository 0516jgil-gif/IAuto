"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [step, setStep] = useState(1);
  const [pendingEmail, setPendingEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [formData, setFormData] = useState({ nombre: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  // Reset password flow
  const [mode, setMode] = useState("auth"); // "auth" | "reset"
  const [resetStep, setResetStep] = useState(1); // 1=email, 2=pin, 3=nueva contraseña
  const [resetEmail, setResetEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let endpoint, body;
    if (isAdmin) {
      endpoint = "/api/admin-login";
      body = { email: formData.email, password: formData.password };
    } else if (isLogin) {
      endpoint = "/api/login";
      body = { email: formData.email, password: formData.password };
    } else {
      endpoint = "/api/Clientes";
      body = formData;
    }
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.pendingVerification) {
        setPendingEmail(data.email);
        setStep(2);
      } else {
        localStorage.setItem("userId", data.id);
        localStorage.setItem("lastActivity", new Date().getTime().toString());
        if (isAdmin) {
          localStorage.setItem("userRol", "admin");
          localStorage.setItem("userName", data.nombre);
          router.push("/Empleados");
        } else {
          localStorage.setItem("userRol", "cliente");
          router.push("/Vehiculos");
        }
      }
    } else {
      const err = await res.json();
      alert(err.error || "Error al procesar la solicitud");
    }
    setLoading(false);
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    const tipo = isAdmin ? "admin" : "cliente";
    const res = await fetch("/api/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: pendingEmail, code: verificationCode, tipo }),
    });
    if (res.ok) {
      const user = await res.json();
      localStorage.setItem("userId", user.id);
      localStorage.setItem("lastActivity", new Date().getTime().toString());
      if (isAdmin) {
        localStorage.setItem("userRol", "admin");
        localStorage.setItem("userName", user.nombre);
        router.push("/Empleados");
      } else {
        localStorage.setItem("userRol", "cliente");
        router.push("/Vehiculos");
      }
    } else {
      const err = await res.json();
      alert(err.error || "Código incorrecto");
    }
    setLoading(false);
  };

  const handleResetRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    const tipo = isAdmin ? "admin" : "cliente";
    const res = await fetch("/api/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: resetEmail, tipo }),
    });
    if (res.ok) {
      setResetStep(2);
    } else {
      const err = await res.json();
      alert(err.error || "Error al enviar el código");
    }
    setLoading(false);
  };

  const handleResetVerify = (e) => {
    e.preventDefault();
    setResetStep(3);
  };

  const handleResetConfirm = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }
    setLoading(true);
    const tipo = isAdmin ? "admin" : "cliente";
    const res = await fetch("/api/reset-password/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: resetEmail, code: resetCode, newPassword, tipo }),
    });
    if (res.ok) {
      alert("¡Contraseña cambiada con éxito! Ya puedes iniciar sesión.");
      setMode("auth");
      setResetStep(1);
      setResetEmail("");
      setResetCode("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      const err = await res.json();
      alert(err.error || "Error al cambiar la contraseña");
    }
    setLoading(false);
  };

  const cancelReset = () => {
    setMode("auth");
    setResetStep(1);
    setResetEmail("");
    setResetCode("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const inputStyle = {
    width: "100%", padding: "12px 16px", marginBottom: "1rem",
    borderRadius: "10px", border: "1px solid #333",
    backgroundColor: "#0a0a0a", color: "#fff",
    boxSizing: "border-box", fontSize: "0.95rem",
    outline: "none", transition: "border-color 0.2s",
  };

  const accentColor = isAdmin ? "#7c3aed" : "#3b82f6";

  const btnStyle = {
    width: "100%", padding: "13px",
    backgroundColor: accentColor,
    color: "#fff", border: "none", borderRadius: "10px",
    cursor: "pointer", fontWeight: "700", fontSize: "1rem",
    transition: "opacity 0.2s"
  };

  return (
    <div style={{
      backgroundColor: "#000", minHeight: "100vh",
      display: "flex", justifyContent: "center", alignItems: "center",
      color: "#fff", fontFamily: "sans-serif",
      backgroundImage: "radial-gradient(ellipse at 50% 0%, rgba(59,130,246,0.15) 0%, transparent 60%)"
    }}>
      <div style={{
        backgroundColor: "#0d0d0d", padding: "2.5rem",
        borderRadius: "20px", border: "1px solid #1f1f1f",
        width: "90%", maxWidth: "420px",
        boxShadow: "0 25px 50px rgba(0,0,0,0.6)"
      }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <span onClick={() => router.push("/")} style={{ fontSize: "1.8rem", fontWeight: "800", color: "#3b82f6", letterSpacing: "2px", cursor: "pointer" }}>
            IAUTO
          </span>
        </div>

        {/* ── LOGIN NORMAL ── */}
        {mode === "auth" && step === 1 && (
          <>
            <div style={{ display: "flex", marginBottom: "2rem", borderRadius: "12px", overflow: "hidden", border: "1px solid #222" }}>
              <button onClick={() => setIsAdmin(false)} style={{
                flex: 1, padding: "10px", border: "none", cursor: "pointer",
                backgroundColor: !isAdmin ? "#3b82f6" : "#111",
                color: !isAdmin ? "#fff" : "#666", fontWeight: "600", transition: "0.2s"
              }}>Cliente</button>
              <button onClick={() => setIsAdmin(true)} style={{
                flex: 1, padding: "10px", border: "none", cursor: "pointer",
                backgroundColor: isAdmin ? "#7c3aed" : "#111",
                color: isAdmin ? "#fff" : "#666", fontWeight: "600", transition: "0.2s"
              }}>🔒 Admin</button>
            </div>

            <h2 style={{ textAlign: "center", marginTop: 0, marginBottom: "1.5rem", fontSize: "1.1rem", color: "#aaa" }}>
              {isAdmin ? "Acceso de Administrador" : (isLogin ? "Bienvenido de vuelta" : "Crear cuenta")}
            </h2>

            <form onSubmit={handleSubmit}>
              {!isLogin && !isAdmin && (
                <input placeholder="Nombre completo" required style={inputStyle}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} />
              )}
              <input type="email" placeholder={isAdmin ? "Email de empleado" : "Email"} required style={inputStyle}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              <input type="password" placeholder="Contraseña" required style={inputStyle}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
              <button type="submit" disabled={loading} style={{ ...btnStyle, opacity: loading ? 0.7 : 1 }}>
                {loading ? "Cargando..." : (isAdmin ? "Acceder como Admin" : (isLogin ? "Entrar" : "Crear Cuenta"))}
              </button>
            </form>

            {isLogin && (
              <p onClick={() => { setMode("reset"); setResetStep(1); }} style={{
                textAlign: "center", marginTop: "0.8rem",
                cursor: "pointer", color: "#555", fontSize: "0.88rem"
              }}>
                ¿Olvidaste tu contraseña?{" "}
                <span style={{ color: accentColor }}>Restablecerla</span>
              </p>
            )}

            {!isAdmin && (
              <p onClick={() => setIsLogin(!isLogin)} style={{
                textAlign: "center", marginTop: "0.6rem",
                cursor: "pointer", color: "#555", fontSize: "0.9rem"
              }}>
                {isLogin ? "¿No tienes cuenta? " : "¿Ya tienes cuenta? "}
                <span style={{ color: "#3b82f6" }}>{isLogin ? "Regístrate" : "Inicia sesión"}</span>
              </p>
            )}
          </>
        )}

        {mode === "auth" && step === 2 && (
          <>
            <h2 style={{ textAlign: "center", marginTop: 0, marginBottom: "0.5rem", fontSize: "1.1rem", color: "#aaa" }}>
              Verificación en dos pasos
            </h2>
            <p style={{ textAlign: "center", color: "#555", fontSize: "0.88rem", marginBottom: "1.5rem" }}>
              Hemos enviado un código de 6 dígitos a<br />
              <strong style={{ color: "#fff" }}>{pendingEmail}</strong>
            </p>
            <form onSubmit={handleVerify}>
              <input type="text" placeholder="Introduce el código" required maxLength={6}
                style={{ ...inputStyle, textAlign: "center", fontSize: "1.8rem", letterSpacing: "10px", fontWeight: "700" }}
                onChange={(e) => setVerificationCode(e.target.value)} />
              <button type="submit" disabled={loading} style={{ ...btnStyle, opacity: loading ? 0.7 : 1 }}>
                {loading ? "Verificando..." : "Confirmar código"}
              </button>
            </form>
            <p onClick={() => setStep(1)} style={{ textAlign: "center", marginTop: "1rem", cursor: "pointer", color: "#333", fontSize: "0.85rem" }}>
              ← Volver atrás
            </p>
          </>
        )}

        {/* ── RESTABLECER CONTRASEÑA ── */}
        {mode === "reset" && resetStep === 1 && (
          <>
            <h2 style={{ textAlign: "center", marginTop: 0, marginBottom: "0.5rem", fontSize: "1.1rem", color: "#aaa" }}>
              Restablecer contraseña
            </h2>
            <p style={{ textAlign: "center", color: "#555", fontSize: "0.88rem", marginBottom: "1.5rem" }}>
              Introduce tu email y te enviaremos un código de verificación.
            </p>
            <form onSubmit={handleResetRequest}>
              <input type="email" placeholder="Tu email" required value={resetEmail} style={inputStyle}
                onChange={(e) => setResetEmail(e.target.value)} />
              <button type="submit" disabled={loading} style={{ ...btnStyle, opacity: loading ? 0.7 : 1 }}>
                {loading ? "Enviando..." : "Enviar código"}
              </button>
            </form>
            <p onClick={cancelReset} style={{ textAlign: "center", marginTop: "1rem", cursor: "pointer", color: "#333", fontSize: "0.85rem" }}>
              ← Volver al inicio de sesión
            </p>
          </>
        )}

        {mode === "reset" && resetStep === 2 && (
          <>
            <h2 style={{ textAlign: "center", marginTop: 0, marginBottom: "0.5rem", fontSize: "1.1rem", color: "#aaa" }}>
              Código de verificación
            </h2>
            <p style={{ textAlign: "center", color: "#555", fontSize: "0.88rem", marginBottom: "1.5rem" }}>
              Hemos enviado un código de 6 dígitos a<br />
              <strong style={{ color: "#fff" }}>{resetEmail}</strong>
            </p>
            <form onSubmit={handleResetVerify}>
              <input type="text" placeholder="Código de 6 dígitos" required maxLength={6} value={resetCode}
                style={{ ...inputStyle, textAlign: "center", fontSize: "1.8rem", letterSpacing: "10px", fontWeight: "700" }}
                onChange={(e) => setResetCode(e.target.value)} />
              <button type="submit" disabled={loading || resetCode.length < 6}
                style={{ ...btnStyle, opacity: (loading || resetCode.length < 6) ? 0.5 : 1 }}>
                Verificar código
              </button>
            </form>
            <p onClick={() => setResetStep(1)} style={{ textAlign: "center", marginTop: "1rem", cursor: "pointer", color: "#333", fontSize: "0.85rem" }}>
              ← Volver atrás
            </p>
          </>
        )}

        {mode === "reset" && resetStep === 3 && (
          <>
            <h2 style={{ textAlign: "center", marginTop: 0, marginBottom: "0.5rem", fontSize: "1.1rem", color: "#aaa" }}>
              Nueva contraseña
            </h2>
            <p style={{ textAlign: "center", color: "#555", fontSize: "0.88rem", marginBottom: "1.5rem" }}>
              Elige una nueva contraseña segura para tu cuenta.
            </p>
            <form onSubmit={handleResetConfirm}>
              <input type="password" placeholder="Nueva contraseña" required minLength={6} value={newPassword}
                style={inputStyle} onChange={(e) => setNewPassword(e.target.value)} />
              <input type="password" placeholder="Confirmar contraseña" required minLength={6} value={confirmPassword}
                style={{ ...inputStyle, borderColor: confirmPassword && newPassword !== confirmPassword ? "#ef4444" : "#333" }}
                onChange={(e) => setConfirmPassword(e.target.value)} />
              {confirmPassword && newPassword !== confirmPassword && (
                <p style={{ color: "#ef4444", fontSize: "0.82rem", marginTop: "-0.7rem", marginBottom: "1rem" }}>
                  Las contraseñas no coinciden
                </p>
              )}
              <button type="submit"
                disabled={loading || newPassword !== confirmPassword || newPassword.length < 6}
                style={{ ...btnStyle, opacity: (loading || newPassword !== confirmPassword || newPassword.length < 6) ? 0.5 : 1 }}>
                {loading ? "Guardando..." : "Cambiar contraseña"}
              </button>
            </form>
            <p onClick={() => setResetStep(2)} style={{ textAlign: "center", marginTop: "1rem", cursor: "pointer", color: "#333", fontSize: "0.85rem" }}>
              ← Volver atrás
            </p>
          </>
        )}

        <p onClick={() => router.push("/")} style={{
          textAlign: "center", marginTop: "0.8rem",
          cursor: "pointer", color: "#333", fontSize: "0.85rem"
        }}>
          ← volver al inicio
        </p>
      </div>
    </div>
  );
}

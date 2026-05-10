"use client";
import { useState, useRef, useEffect } from "react";

export default function ChatWidget() {
  const [abierto, setAbierto] = useState(false);
  const [mensajes, setMensajes] = useState([
    { role: "assistant", content: "¡Hola! Soy el asistente de IAUTO 🚗 ¿En qué puedo ayudarte? Puedo informarte sobre nuestros vehículos, precios y proceso de compra." }
  ]);
  const [input, setInput] = useState("");
  const [cargando, setCargando] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (abierto) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes, abierto]);

  const enviar = async () => {
    const texto = input.trim();
    if (!texto || cargando) return;

    const nuevosMensajes = [...mensajes, { role: "user", content: texto }];
    setMensajes(nuevosMensajes);
    setInput("");
    setCargando(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nuevosMensajes.map(m => ({ role: m.role, content: m.content }))
        }),
      });
      const data = await res.json();
      setMensajes(prev => [...prev, { role: "assistant", content: data.message || "Error al responder." }]);
    } catch {
      setMensajes(prev => [...prev, { role: "assistant", content: "Ha ocurrido un error. Inténtalo de nuevo." }]);
    } finally {
      setCargando(false);
    }
  };

  return (
    <>
      {/* Ventana de chat */}
      {abierto && (
        <div className="iauto-chat-window" style={{
          position: "fixed", bottom: "90px", right: "24px",
          width: "360px", height: "500px",
          backgroundColor: "#0d0d0d", border: "1px solid #1a1a1a",
          borderRadius: "20px", display: "flex", flexDirection: "column",
          zIndex: 9999, boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
          fontFamily: "sans-serif", overflow: "hidden",
        }}>
          {/* Header */}
          <div style={{
            padding: "1rem 1.2rem", borderBottom: "1px solid #1a1a1a",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            backgroundColor: "#111",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <div style={{
                width: "36px", height: "36px", borderRadius: "50%",
                backgroundColor: "#3b82f6", display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: "0.75rem", fontWeight: "800", color: "#fff",
              }}>IA</div>
              <div>
                <p style={{ margin: 0, color: "#fff", fontWeight: "700", fontSize: "0.9rem" }}>Asistente IAUTO</p>
                <p style={{ margin: 0, color: "#10b981", fontSize: "0.72rem" }}>● En línea</p>
              </div>
            </div>
            <button
              onClick={() => setAbierto(false)}
              style={{ background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: "1.2rem" }}
            >✕</button>
          </div>

          {/* Mensajes */}
          <div style={{ flex: 1, overflowY: "auto", padding: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {mensajes.map((m, i) => (
              <div key={i} style={{
                display: "flex",
                justifyContent: m.role === "user" ? "flex-end" : "flex-start",
              }}>
                <div style={{
                  maxWidth: "80%", padding: "0.65rem 1rem",
                  borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                  backgroundColor: m.role === "user" ? "#3b82f6" : "#1a1a1a",
                  color: "#fff", fontSize: "0.85rem", lineHeight: "1.5",
                }}>
                  {m.content .replace(/\*\*(.*?)\*\*/g, '$1') .replace(/^\* /gm, '• ') .replace(/\*(.*?)\*/g, '$1') .replace(/#+ (.*)/g, '$1') }
                </div>
              </div>
            ))}
            {cargando && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div style={{
                  padding: "0.65rem 1rem", borderRadius: "18px 18px 18px 4px",
                  backgroundColor: "#1a1a1a", color: "#555", fontSize: "0.85rem",
                }}>
                  <span>●&nbsp;</span><span style={{ animation: "pulse 1s infinite" }}>●&nbsp;</span><span>●</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: "0.75rem 1rem", borderTop: "1px solid #1a1a1a",
            display: "flex", gap: "0.5rem", backgroundColor: "#111",
          }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && enviar()}
              placeholder="Escribe tu pregunta..."
              disabled={cargando}
              style={{
                flex: 1, backgroundColor: "#0d0d0d", border: "1px solid #222",
                borderRadius: "12px", padding: "0.6rem 1rem",
                color: "#fff", fontSize: "0.85rem", outline: "none",
              }}
            />
            <button
              onClick={enviar}
              disabled={cargando || !input.trim()}
              style={{
                backgroundColor: input.trim() && !cargando ? "#3b82f6" : "#1a1a1a",
                border: "none", borderRadius: "12px", padding: "0.6rem 1rem",
                color: "#fff", cursor: input.trim() && !cargando ? "pointer" : "not-allowed",
                fontSize: "1rem", transition: "background-color 0.2s",
              }}
            >➤</button>
          </div>
        </div>
      )}

      {/* Botón flotante */}
      <button
        className="iauto-chat-toggle"
        onClick={() => setAbierto(prev => !prev)}
        style={{
          position: "fixed", bottom: "24px", right: "24px",
          width: "56px", height: "56px", borderRadius: "50%",
          backgroundColor: "#3b82f6", border: "none",
          cursor: "pointer", zIndex: 9999,
          boxShadow: "0 4px 20px rgba(59,130,246,0.5)",
          fontSize: "1.5rem", display: "flex", alignItems: "center",
          justifyContent: "center", transition: "transform 0.2s, box-shadow 0.2s",
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.1)"; e.currentTarget.style.boxShadow = "0 6px 28px rgba(59,130,246,0.7)"; }}
        onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(59,130,246,0.5)"; }}
        title="Asistente IAUTO"
      >
        {abierto ? "✕" : <span style={{ fontWeight: "800", fontSize: "0.9rem", letterSpacing: "1px" }}>IA</span>}
      </button>
    </>
  );
}

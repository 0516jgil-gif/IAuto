import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req) {
  try {
    const { messages } = await req.json();

    // Cargamos el catálogo actual para que el asistente lo conozca
    const vehiculos = await prisma.vehiculo.findMany();
    const catalogo = vehiculos
      .map(v => `- ${v.marca} ${v.modelo}: ${v.precio.toLocaleString()}€, stock: ${v.stock} unidades`)
      .join("\n");

    // Convertimos el historial al formato de Gemini
    const historial = messages.slice(0, -1).map(m => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const ultimoMensaje = messages[messages.length - 1].content;

    const body = {
      system_instruction: {
        parts: [{
          text: `Eres el asistente virtual de IAUTO, una concesionaria de coches online.
Eres amable, conciso y ayudas a los clientes a encontrar el vehículo perfecto.
Respondes siempre en español y con respuestas cortas.

Catálogo actual de vehículos:
${catalogo}

Puedes ayudar con:
- Información sobre los coches del catálogo (precio, disponibilidad)
- Dudas sobre el proceso de compra
- Comparativas y recomendaciones según presupuesto

Si te preguntan algo que no tiene que ver con coches o la concesionaria, redirige amablemente la conversación.`
        }]
      },
      contents: [
        ...historial,
        { role: "user", parts: [{ text: ultimoMensaje }] }
      ],
      generationConfig: {
        maxOutputTokens: 500,
        temperature: 0.7,
      }
    };

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      console.error("Gemini error:", data);
      return NextResponse.json({ error: "Error de la IA" }, { status: 500 });
    }

    const texto = data.candidates?.[0]?.content?.parts?.[0]?.text || "No he podido responder.";
    return NextResponse.json({ message: texto });

  } catch (err) {
    console.error("Chat error:", err);
    return NextResponse.json({ error: "Error al procesar la consulta" }, { status: 500 });
  }
}

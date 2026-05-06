import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No se recibió ningún archivo" }, { status: 400 });
    }

    // Validar que sea una imagen
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: "Solo se admiten imágenes JPG, PNG, WEBP o GIF" }, { status: 400 });
    }

    // Validar tamaño máximo 5MB
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "La imagen no puede superar 5MB" }, { status: 400 });
    }

    const nombreArchivo = `vehiculos/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;

    const blob = await put(nombreArchivo, file, {
      access: "public",
    });

    return NextResponse.json({ url: blob.url });
  } catch (err) {
    console.error("Error al subir imagen:", err);
    return NextResponse.json({ error: "Error al subir la imagen" }, { status: 500 });
  }
}

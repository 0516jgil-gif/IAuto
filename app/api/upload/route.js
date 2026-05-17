import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

export const runtime = "nodejs";

const safeExtension = (file) => {
  const extension = path.extname(file.name || "").toLowerCase();
  if ([".jpg", ".jpeg", ".png", ".webp", ".gif"].includes(extension)) return extension;

  return `.${file.type.split("/")[1] || "png"}`;
};

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No se recibio ningun archivo" }, { status: 400 });
    }

    if (!file.type?.startsWith("image/")) {
      return NextResponse.json({ error: "Solo se pueden subir imagenes." }, { status: 400 });
    }

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      if (process.env.VERCEL) {
        return NextResponse.json(
          { error: "Falta configurar BLOB_READ_WRITE_TOKEN en las variables de entorno de Vercel." },
          { status: 500 }
        );
      }

      const uploadDir = path.join(process.cwd(), "public", "uploads");
      await mkdir(uploadDir, { recursive: true });

      const fileName = `${Date.now()}-${randomUUID()}${safeExtension(file)}`;
      const filePath = path.join(uploadDir, fileName);

      await writeFile(filePath, Buffer.from(await file.arrayBuffer()));
      return NextResponse.json({ url: `/uploads/${fileName}` });
    }

    const blob = await put(`vehiculos/${Date.now()}-${file.name.replace(/\s+/g, "-")}`, file, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return NextResponse.json({ url: blob.url });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

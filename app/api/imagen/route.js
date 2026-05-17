import { NextResponse } from "next/server";

const ALLOWED_HOST_SUFFIX = ".public.blob.vercel-storage.com";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const rawUrl = searchParams.get("url");

    if (!rawUrl) {
      return NextResponse.json({ error: "Falta la URL de la imagen" }, { status: 400 });
    }

    const url = new URL(rawUrl);
    if (url.protocol !== "https:" || !url.hostname.endsWith(ALLOWED_HOST_SUFFIX)) {
      return NextResponse.json({ error: "URL de imagen no permitida" }, { status: 400 });
    }

    const upstream = await fetch(url, {
      headers: { accept: "image/*" },
      cache: "force-cache",
      next: { revalidate: 86400 },
    });

    if (!upstream.ok) {
      return NextResponse.json({ error: "No se pudo cargar la imagen" }, { status: upstream.status });
    }

    const contentType = upstream.headers.get("content-type") || "application/octet-stream";
    if (!contentType.startsWith("image/")) {
      return NextResponse.json({ error: "El recurso no es una imagen" }, { status: 400 });
    }

    return new Response(upstream.body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    });
  } catch (err) {
    console.error("Image proxy error:", err);
    return NextResponse.json({ error: "Error cargando la imagen" }, { status: 500 });
  }
}

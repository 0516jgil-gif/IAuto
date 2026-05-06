import { handleUpload } from "@vercel/blob/client";
import { NextResponse } from "next/server";

export async function POST(request) {
  // Comprobamos que el token existe
  console.log("TOKEN existe:", !!process.env.BLOB_READ_WRITE_TOKEN);
  console.log("TOKEN valor:", process.env.BLOB_READ_WRITE_TOKEN?.slice(0, 20) + "...");

  const body = await request.json();
  console.log("Body recibido:", JSON.stringify(body).slice(0, 100));

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        return {
          allowedContentTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
        };
      },
      onUploadCompleted: async ({ blob }) => {
        console.log("Subida completada:", blob.url);
      },
    });

    console.log("Respuesta handleUpload:", JSON.stringify(jsonResponse).slice(0, 100));
    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error("Upload error completo:", error);
    return NextResponse.json({ error: error.message, stack: error.stack }, { status: 400 });
  }
}

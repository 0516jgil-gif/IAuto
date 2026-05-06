export const dynamic = "force-dynamic";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req, context) {
  try {
    const { id: rawId } = await context.params;
    const id = Number(rawId);

    if (!id || isNaN(id)) {
      return NextResponse.json({ error: "ID no válido" }, { status: 400 });
    }

    const vehiculo = await prisma.vehiculo.findUnique({
      where: { id },
    });

    if (!vehiculo) {
      return NextResponse.json({ error: "Vehículo no encontrado" }, { status: 404 });
    }

    return NextResponse.json(vehiculo);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 });
  }
}
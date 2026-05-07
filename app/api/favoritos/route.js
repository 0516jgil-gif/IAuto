export const dynamic = "force-dynamic";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const clienteId = Number(searchParams.get("clienteId"));

    if (!clienteId) {
      return NextResponse.json({ error: "ID de cliente no vÃ¡lido" }, { status: 400 });
    }

    const favoritos = await prisma.favorito.findMany({
      where: { clienteId },
      include: { vehiculo: true },
      orderBy: { fecha: "desc" },
    });

    return NextResponse.json(favoritos);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const clienteId = Number(body.clienteId);
    const vehiculoId = Number(body.vehiculoId);

    if (!clienteId || !vehiculoId) {
      return NextResponse.json({ error: "Faltan datos para guardar el favorito" }, { status: 400 });
    }

    const favorito = await prisma.favorito.upsert({
      where: { clienteId_vehiculoId: { clienteId, vehiculoId } },
      update: {},
      create: { clienteId, vehiculoId },
      include: { vehiculo: true },
    });

    return NextResponse.json(favorito);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const clienteId = Number(searchParams.get("clienteId"));
    const vehiculoId = Number(searchParams.get("vehiculoId"));

    if (!clienteId || !vehiculoId) {
      return NextResponse.json({ error: "Faltan datos para eliminar el favorito" }, { status: 400 });
    }

    await prisma.favorito.delete({
      where: { clienteId_vehiculoId: { clienteId, vehiculoId } },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

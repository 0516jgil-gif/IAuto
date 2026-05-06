export const dynamic = "force-dynamic";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const vehiculos = await prisma.vehiculo.findMany();
  return NextResponse.json(vehiculos);
}

export async function POST(req) {
  const body = await req.json();
  const vehiculo = await prisma.vehiculo.create({ data: body });
  return NextResponse.json(vehiculo);
}

export async function PUT(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));
    const body = await req.json();

    if (!id) {
      return NextResponse.json({ error: "ID de vehículo no válido" }, { status: 400 });
    }

    if (!body.marca || !body.modelo || body.precio === undefined || body.stock === undefined) {
      return NextResponse.json({ error: "Faltan campos" }, { status: 400 });
    }

    const precio = Number(body.precio);
    const stock = Number(body.stock);

    if (Number.isNaN(precio) || Number.isNaN(stock)) {
      return NextResponse.json({ error: "Precio o stock no válido" }, { status: 400 });
    }

    const vehiculo = await prisma.vehiculo.update({
      where: { id },
      data: {
        marca: body.marca,
        modelo: body.modelo,
        precio,
        stock,
      },
    });

    return NextResponse.json(vehiculo);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));

    if (!id) {
      return NextResponse.json({ error: "ID de vehículo no válido" }, { status: 400 });
    }

    await prisma.vehiculo.delete({
      where: { id },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);

    if (err.code === "P2003") {
      return NextResponse.json(
        { error: "No se puede eliminar este vehículo porque tiene ventas asociadas." },
        { status: 409 }
      );
    }

    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

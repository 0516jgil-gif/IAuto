export const dynamic = "force-dynamic"; 
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();

    if (!body.nombre || !body.email || !body.telefono) {
      return NextResponse.json({ error: "Faltan campos" }, { status: 400 });
    }

    const cliente = await prisma.cliente.create({ data: body });
    return NextResponse.json(cliente);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const clientes = await prisma.cliente.findMany();
    return NextResponse.json(clientes);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));
    const body = await req.json();

    if (!id) {
      return NextResponse.json({ error: "ID de cliente no válido" }, { status: 400 });
    }

    if (!body.nombre || !body.email || !body.telefono) {
      return NextResponse.json({ error: "Faltan campos" }, { status: 400 });
    }

    const cliente = await prisma.cliente.update({
      where: { id },
      data: {
        nombre: body.nombre,
        email: body.email,
        telefono: body.telefono,
      },
    });

    return NextResponse.json(cliente);
  } catch (err) {
    console.error(err);

    if (err.code === "P2002") {
      return NextResponse.json(
        { error: "Ya existe un cliente con ese email." },
        { status: 409 }
      );
    }

    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));

    if (!id) {
      return NextResponse.json({ error: "ID de cliente no válido" }, { status: 400 });
    }

    await prisma.cliente.delete({
      where: { id },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);

    if (err.code === "P2003") {
      return NextResponse.json(
        { error: "No se puede eliminar este cliente porque tiene ventas asociadas." },
        { status: 409 }
      );
    }

    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

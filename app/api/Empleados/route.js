export const dynamic = "force-dynamic";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

const empleadoSelect = {
  id: true,
  nombre: true,
  email: true,
  rol: true,
  ventas: true,
};

function normalizarRol(rol) {
  return rol === "administrador" ? "administrador" : "trabajador";
}

export async function GET() {
  const empleados = await prisma.empleado.findMany({
    select: empleadoSelect,
    orderBy: { id: "asc" },
  });
  return NextResponse.json(empleados);
}

export async function POST(req) {
  try {
    const body = await req.json();

    if (!body.nombre || !body.email || !body.password) {
      return NextResponse.json({ error: "Faltan campos" }, { status: 400 });
    }

    const empleado = await prisma.empleado.create({
      data: {
        nombre: body.nombre.trim(),
        email: body.email.trim(),
        rol: normalizarRol(body.rol),
        password: await bcrypt.hash(body.password, 10),
      },
      select: empleadoSelect,
    });

    return NextResponse.json(empleado);
  } catch (err) {
    if (err.code === "P2002") {
      return NextResponse.json({ error: "Ya existe un trabajador con ese email." }, { status: 409 });
    }
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));
    const body = await req.json();

    if (!id) {
      return NextResponse.json({ error: "ID de trabajador no válido" }, { status: 400 });
    }

    if (!body.nombre || !body.email) {
      return NextResponse.json({ error: "Faltan campos" }, { status: 400 });
    }

    const updateData = {
      nombre: body.nombre.trim(),
      email: body.email.trim(),
      rol: normalizarRol(body.rol),
    };

    if (body.password) {
      updateData.password = await bcrypt.hash(body.password, 10);
    }

    const empleado = await prisma.empleado.update({
      where: { id },
      data: updateData,
      select: empleadoSelect,
    });

    return NextResponse.json(empleado);
  } catch (err) {
    if (err.code === "P2002") {
      return NextResponse.json({ error: "Ya existe un trabajador con ese email." }, { status: 409 });
    }
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));

    if (!id) {
      return NextResponse.json({ error: "ID de trabajador no válido" }, { status: 400 });
    }

    await prisma.empleado.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err.code === "P2003") {
      return NextResponse.json(
        { error: "No se puede eliminar este trabajador porque tiene ventas asociadas." },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

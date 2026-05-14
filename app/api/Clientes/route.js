export const dynamic = "force-dynamic";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/lib/email";

function isMissingTelefonoColumn(err) {
  return String(err?.message || "").includes("Cliente.telefono");
}

async function ensureTelefonoColumn() {
  await prisma.$executeRawUnsafe('ALTER TABLE "Cliente" ADD COLUMN IF NOT EXISTS "telefono" TEXT');
}

export async function POST(req) {
  try {
    const body = await req.json();

    if (!body.nombre || !body.email || !body.telefono || !body.password) {
      return NextResponse.json({ error: "Faltan campos" }, { status: 400 });
    }

    const existe = await prisma.cliente.findUnique({ where: { email: body.email } });
    if (existe) {
      return NextResponse.json({ error: "Ya existe una cuenta con ese email" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    const data = {
      nombre: body.nombre.trim(),
      email: body.email.trim(),
      telefono: body.telefono.trim(),
      password: hashedPassword,
      verificationCode: code,
    };

    let cliente;
    try {
      cliente = await prisma.cliente.create({ data });
    } catch (err) {
      if (!isMissingTelefonoColumn(err)) throw err;
      await ensureTelefonoColumn();
      cliente = await prisma.cliente.create({ data });
    }

    await sendVerificationEmail(body.email, code, body.nombre);

    return NextResponse.json({ email: cliente.email, nombre: cliente.nombre, telefono: cliente.telefono, pendingVerification: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const clientes = await prisma.cliente.findMany({
      select: { id: true, nombre: true, email: true, telefono: true, ventas: true },
    });
    return NextResponse.json(clientes);
  } catch (err) {
    if (isMissingTelefonoColumn(err)) {
      await ensureTelefonoColumn();
      const clientes = await prisma.cliente.findMany({
        select: { id: true, nombre: true, email: true, telefono: true, ventas: true },
      });
      return NextResponse.json(clientes);
    }

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

    const updateData = {
      nombre: body.nombre.trim(),
      email: body.email.trim(),
      telefono: body.telefono.trim(),
    };
    if (body.password) {
      updateData.password = await bcrypt.hash(body.password, 10);
    }

    let cliente;
    try {
      cliente = await prisma.cliente.update({ where: { id }, data: updateData });
    } catch (err) {
      if (!isMissingTelefonoColumn(err)) throw err;
      await ensureTelefonoColumn();
      cliente = await prisma.cliente.update({ where: { id }, data: updateData });
    }

    return NextResponse.json(cliente);
  } catch (err) {
    console.error(err);
    if (err.code === "P2002") {
      return NextResponse.json({ error: "Ya existe un cliente con ese email." }, { status: 409 });
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

    await prisma.cliente.delete({ where: { id } });
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

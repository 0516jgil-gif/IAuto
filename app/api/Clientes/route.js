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
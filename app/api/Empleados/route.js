import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const empleados = await prisma.empleado.findMany();
  return NextResponse.json(empleados);
}

export async function POST(req) {
  const body = await req.json();
  const empleado = await prisma.empleado.create({ data: body });
  return NextResponse.json(empleado);
}
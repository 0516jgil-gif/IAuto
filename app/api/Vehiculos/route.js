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
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const ventas = await prisma.venta.findMany({
    include: { cliente: true, empleado: true, vehiculo: true }
  });
  return NextResponse.json(ventas);
}

export async function POST(req) {
  const body = await req.json();

  // Calcular total y actualizar stock
  const vehiculo = await prisma.vehiculo.findUnique({ where: { id: body.vehiculoId } });
  if (!vehiculo || vehiculo.stock < body.cantidad) {
    return NextResponse.json({ error: "Stock insuficiente" }, { status: 400 });
  }

  const total = vehiculo.precio * body.cantidad;

  // Crear venta
  const venta = await prisma.venta.create({
    data: {
      clienteId: body.clienteId,
      empleadoId: body.empleadoId,
      vehiculoId: body.vehiculoId,
      cantidad: body.cantidad,
      total
    }
  });

  // Actualizar stock
  await prisma.vehiculo.update({
    where: { id: body.vehiculoId },
    data: { stock: vehiculo.stock - body.cantidad }
  });

  return NextResponse.json(venta);
}
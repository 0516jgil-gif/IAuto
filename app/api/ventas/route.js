export const dynamic = "force-dynamic";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { sendSaleCancellationEmail, sendSaleConfirmationEmail } from "@/lib/email";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const clienteId = Number(searchParams.get("clienteId"));
  const estado = searchParams.get("estado");

  const ventas = await prisma.venta.findMany({
    where: {
      ...(clienteId ? { clienteId } : {}),
      ...(estado ? { estado } : clienteId ? { estado: "pendiente" } : {}),
    },
    include: { cliente: true, empleado: true, vehiculo: true },
    orderBy: { fecha: "desc" },
  });
  return NextResponse.json(ventas);
}

export async function POST(req) {
  const body = await req.json();
  const clienteId = Number(body.clienteId);
  const vehiculoId = Number(body.vehiculoId);
  const cantidad = Number(body.cantidad || 1);
  let empleadoId = Number(body.empleadoId);

  if (!clienteId || !vehiculoId || !cantidad) {
    return NextResponse.json({ error: "Faltan datos para registrar la compra" }, { status: 400 });
  }

  if (!empleadoId) {
    const empleado = await prisma.empleado.findFirst({ orderBy: { id: "asc" } });
    if (!empleado) {
      return NextResponse.json({ error: "No hay empleados disponibles para asignar la venta" }, { status: 400 });
    }
    empleadoId = empleado.id;
  }

  // Calcular total y actualizar stock
  const vehiculo = await prisma.vehiculo.findUnique({ where: { id: vehiculoId } });
  if (!vehiculo || vehiculo.stock < cantidad) {
    return NextResponse.json({ error: "Stock insuficiente" }, { status: 400 });
  }

  const totalRecibido = Number(body.total);
  const total = Number.isFinite(totalRecibido) && totalRecibido >= 0
    ? totalRecibido
    : vehiculo.precio * cantidad;

  const [venta] = await prisma.$transaction([
    prisma.venta.create({
      data: {
        clienteId,
        empleadoId,
        vehiculoId,
        cantidad,
        total,
      },
      include: { cliente: true, empleado: true, vehiculo: true },
    }),
    prisma.vehiculo.update({
      where: { id: vehiculoId },
      data: { stock: { decrement: cantidad } },
    }),
  ]);

  return NextResponse.json(venta);
}

export async function PATCH(req) {
  try {
    const body = await req.json();
    const id = Number(body.id);
    const accion = body.accion || "procesar";

    if (!id || accion !== "procesar") {
      return NextResponse.json({ error: "Solicitud de venta no válida" }, { status: 400 });
    }

    const venta = await prisma.venta.findUnique({
      where: { id },
      include: { cliente: true, empleado: true, vehiculo: true },
    });

    if (!venta) {
      return NextResponse.json({ error: "Venta no encontrada" }, { status: 404 });
    }

    if (!venta.cliente?.email) {
      return NextResponse.json({ error: "El cliente no tiene email asociado" }, { status: 400 });
    }

    if (venta.estado === "realizada") {
      return NextResponse.json({ ok: true, venta });
    }

    await sendSaleConfirmationEmail(venta.cliente.email, venta);
    const ventaRealizada = await prisma.venta.update({
      where: { id },
      data: { estado: "realizada" },
      include: { cliente: true, empleado: true, vehiculo: true },
    });

    return NextResponse.json({ ok: true, venta: ventaRealizada });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message || "No se pudo procesar la venta" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));

    if (!id) {
      return NextResponse.json({ error: "ID de venta no válido" }, { status: 400 });
    }

    const venta = await prisma.venta.findUnique({
      where: { id },
      include: { cliente: true, empleado: true, vehiculo: true },
    });

    if (!venta) {
      return NextResponse.json({ error: "Venta no encontrada" }, { status: 404 });
    }

    if (venta.cliente?.email) {
      await sendSaleCancellationEmail(venta.cliente.email, venta);
    }

    await prisma.$transaction([
      prisma.venta.delete({
        where: { id },
      }),
      prisma.vehiculo.update({
        where: { id: venta.vehiculoId },
        data: {
          stock: {
            increment: venta.cantidad,
          },
        },
      }),
    ]);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

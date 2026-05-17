import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { setTrustedVerificationCookie } from "@/lib/trustedVerification";

function normalizarRol(rol) {
  if (rol === "administrador") return "administrador";
  if (rol === "admin") return "administrador";
  return "trabajador";
}

export async function POST(req) {
  try {
    const { email, code, tipo } = await req.json(); // tipo: "cliente" o "admin"

    if (tipo === "admin") {
      const empleado = await prisma.empleado.findUnique({ where: { email } });

      if (!empleado || empleado.verificationCode !== code) {
        return NextResponse.json({ error: "Código incorrecto" }, { status: 401 });
      }

      await prisma.empleado.update({ where: { email }, data: { verificationCode: null } });
      const res = NextResponse.json({ id: empleado.id, nombre: empleado.nombre, rol: normalizarRol(empleado.rol) });
      setTrustedVerificationCookie(res, empleado.email, "admin");
      return res;
    } else {
      const cliente = await prisma.cliente.findUnique({
        where: { email },
        include: { ventas: true },
      });

      if (!cliente || cliente.verificationCode !== code) {
        return NextResponse.json({ error: "Código incorrecto" }, { status: 401 });
      }

      await prisma.cliente.update({ where: { email }, data: { verificationCode: null } });
      const res = NextResponse.json(cliente);
      setTrustedVerificationCookie(res, cliente.email, "cliente");
      return res;
    }
  } catch (err) {
    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 });
  }
}

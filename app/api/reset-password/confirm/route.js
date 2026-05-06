import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { email, code, newPassword, tipo } = await req.json();

    if (!email || !code || !newPassword) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    if (tipo === "admin") {
      const empleado = await prisma.empleado.findUnique({ where: { email } });

      if (!empleado || empleado.verificationCode !== code) {
        return NextResponse.json({ error: "Código incorrecto o expirado" }, { status: 401 });
      }

      await prisma.empleado.update({
        where: { email },
        data: { password: hashedPassword, verificationCode: null },
      });
    } else {
      const cliente = await prisma.cliente.findUnique({ where: { email } });

      if (!cliente || cliente.verificationCode !== code) {
        return NextResponse.json({ error: "Código incorrecto o expirado" }, { status: 401 });
      }

      await prisma.cliente.update({
        where: { email },
        data: { password: hashedPassword, verificationCode: null },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("reset-password/confirm error:", err);
    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 });
  }
}
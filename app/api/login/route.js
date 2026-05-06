import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    const cliente = await prisma.cliente.findUnique({
      where: { email },
      include: { ventas: true },
    });

    if (!cliente) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    const passwordOk = await bcrypt.compare(password, cliente.password);
    if (!passwordOk) {
      return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await prisma.cliente.update({ where: { email }, data: { verificationCode: code } });
    await sendVerificationEmail(email, code, cliente.nombre);

    return NextResponse.json({ email: cliente.email, nombre: cliente.nombre, pendingVerification: true });
  } catch (err) {
    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 });
  }
}
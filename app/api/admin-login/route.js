import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    const empleado = await prisma.empleado.findUnique({ where: { email } });

    if (!empleado) {
      return NextResponse.json({ error: "Empleado no encontrado" }, { status: 404 });
    }

    if (empleado.rol !== "admin") {
      return NextResponse.json({ error: "No tienes permisos de administrador" }, { status: 403 });
    }

    if (empleado.password) {
      const passwordOk = await bcrypt.compare(password, empleado.password);
      if (!passwordOk) {
        return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 });
      }
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await prisma.empleado.update({ where: { email }, data: { verificationCode: code } });
    await sendVerificationEmail(email, code, empleado.nombre);

    return NextResponse.json({ email: empleado.email, nombre: empleado.nombre, rol: empleado.rol, pendingVerification: true });
  } catch (err) {
    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 });
  }
}
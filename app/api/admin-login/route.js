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

    // Si tiene contraseña hasheada, compara con bcrypt
    // Si tiene contraseña en texto plano (sin $2b$), compara directamente
    let passwordOk = false;
    if (empleado.password) {
      if (empleado.password.startsWith("$2b$") || empleado.password.startsWith("$2a$")) {
        passwordOk = await bcrypt.compare(password, empleado.password);
      } else {
        // Contraseña en texto plano (para compatibilidad inicial)
        passwordOk = empleado.password === password;
        // Aprovechamos para hashearla automáticamente
        if (passwordOk) {
          const hashed = await bcrypt.hash(password, 10);
          await prisma.empleado.update({ where: { email }, data: { password: hashed } });
        }
      }
    } else {
      return NextResponse.json({ error: "El admin no tiene contraseña configurada" }, { status: 401 });
    }

    if (!passwordOk) {
      return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await prisma.empleado.update({ where: { email }, data: { verificationCode: code } });
    await sendVerificationEmail(email, code, empleado.nombre);

    return NextResponse.json({ email: empleado.email, nombre: empleado.nombre, rol: empleado.rol, pendingVerification: true });
  } catch (err) {
    console.error("Error admin-login:", err);
    return NextResponse.json({ error: "Error en el servidor: " + err.message }, { status: 500 });
  }
}
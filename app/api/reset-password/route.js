import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(req) {
  try {
    const { email, tipo } = await req.json(); // tipo: "cliente" o "admin"

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    if (tipo === "admin") {
      const empleado = await prisma.empleado.findUnique({ where: { email } });

      if (!empleado) {
        // Respondemos OK igualmente para no revelar si el email existe
        return NextResponse.json({ ok: true });
      }

      await prisma.empleado.update({
        where: { email },
        data: { verificationCode: code },
      });

      await sendVerificationEmail(email, code, empleado.nombre);
    } else {
      const cliente = await prisma.cliente.findUnique({ where: { email } });

      if (!cliente) {
        return NextResponse.json({ ok: true });
      }

      await prisma.cliente.update({
        where: { email },
        data: { verificationCode: code },
      });

      await sendVerificationEmail(email, code, cliente.nombre);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("reset-password error:", err);
    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 });
  }
}
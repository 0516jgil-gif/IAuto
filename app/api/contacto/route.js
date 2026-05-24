import nodemailer from "nodemailer";

function createTransporter() {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    throw new Error(
      `Faltan credenciales de email. EMAIL_USER="${user}" EMAIL_PASS="${pass ? "***" : "undefined"}"`
    );
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
}

export async function POST(req) {
  try {
    const { nombre, email, telefono, mensaje } = await req.json();

    if (!nombre || !email || !mensaje) {
      return Response.json(
        { error: "Nombre, email y mensaje son obligatorios." },
        { status: 400 }
      );
    }

    const transporter = createTransporter();

    // Enviar email al correo de la empresa
    await transporter.sendMail({
      from: `"IAUTO Contacto" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `Nuevo mensaje de contacto de ${nombre}`,
      html: `
        <div style="font-family:sans-serif;max-width:520px;margin:auto;padding:30px;background:#0d0d0d;color:#fff;border-radius:12px;">
          <h2 style="color:#3b82f6;text-align:center;margin-top:0;">IAUTO — Nuevo Contacto</h2>

          <div style="background:#050505;border:1px solid #222;border-radius:10px;padding:18px;margin:22px 0;">
            <p style="margin:0 0 8px;"><strong>Nombre:</strong> ${nombre}</p>
            <p style="margin:0 0 8px;"><strong>Email:</strong> <a href="mailto:${email}" style="color:#3b82f6;">${email}</a></p>
            ${telefono ? `<p style="margin:0 0 8px;"><strong>Teléfono:</strong> ${telefono}</p>` : ""}
          </div>

          <p style="color:#aaa;margin-bottom:8px;"><strong style="color:#fff;">Mensaje:</strong></p>
          <div style="background:#050505;border-left:3px solid #3b82f6;padding:14px 18px;border-radius:0 8px 8px 0;color:#ccc;line-height:1.7;">
            ${mensaje.replace(/\n/g, "<br>")}
          </div>

          <p style="color:#444;font-size:0.8rem;margin-top:24px;text-align:center;">
            Puedes responder directamente a este correo para contactar con el usuario.
          </p>
        </div>
      `,
    });

    // Enviar confirmación al usuario
    await transporter.sendMail({
      from: `"IAUTO" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Hemos recibido tu mensaje — IAUTO",
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:30px;background:#0d0d0d;color:#fff;border-radius:12px;">
          <h2 style="color:#3b82f6;text-align:center;margin-top:0;">IAUTO</h2>
          <p>Hola <strong>${nombre}</strong>,</p>
          <p>Hemos recibido tu mensaje y te responderemos lo antes posible.</p>
          <div style="background:#050505;border:1px solid #222;border-radius:10px;padding:14px 18px;margin:20px 0;color:#aaa;line-height:1.7;font-style:italic;">
            "${mensaje.length > 200 ? mensaje.substring(0, 200) + "..." : mensaje}"
          </div>
          <p style="color:#666;font-size:0.85rem;margin-top:24px;">Gracias por contactar con IAUTO.</p>
        </div>
      `,
    });

    return Response.json({ ok: true });
  } catch (err) {
    console.error("Error en /api/contacto:", err);
    return Response.json(
      { error: "Error al enviar el mensaje. Inténtalo de nuevo." },
      { status: 500 }
    );
  }
}
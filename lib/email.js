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

export async function sendVerificationEmail(toEmail, code, nombre) {
  const transporter = createTransporter();

  await transporter.sendMail({
    from: `"IAUTO" <${process.env.EMAIL_FROM}>`,
    to: toEmail,
    subject: "Código de verificación - IAUTO",
    html: `
      <div style="font-family:sans-serif;max-width:400px;margin:auto;padding:30px;background:#0d0d0d;color:#fff;border-radius:12px;">
        <h2 style="color:#3b82f6;text-align:center;">IAUTO</h2>
        <p>Hola <strong>${nombre}</strong>,</p>
        <p>Tu código de verificación es:</p>
        <div style="font-size:2.5rem;font-weight:bold;text-align:center;letter-spacing:10px;color:#3b82f6;margin:20px 0;">
          ${code}
        </div>
        <p style="color:#888;font-size:0.85rem;">Este código caduca en 10 minutos. Si no has sido tú, ignora este mensaje.</p>
      </div>
    `,
  });
}

export async function sendSaleConfirmationEmail(toEmail, venta) {
  const transporter = createTransporter();
  const vehiculo = `${venta.vehiculo?.marca || ""} ${venta.vehiculo?.modelo || ""}`.trim() || "vehículo";
  const fecha = venta.fecha ? new Date(venta.fecha).toLocaleDateString("es-ES") : "-";

  await transporter.sendMail({
    from: `"IAUTO" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `Confirmación de compra #${venta.id} - IAUTO`,
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:auto;padding:30px;background:#0d0d0d;color:#fff;border-radius:12px;">
        <h2 style="color:#3b82f6;text-align:center;margin-top:0;">IAUTO</h2>
        <p>Hola <strong>${venta.cliente?.nombre || "cliente"}</strong>,</p>
        <p>Tu compra ha sido procesada correctamente por nuestro equipo.</p>

        <div style="background:#050505;border:1px solid #222;border-radius:10px;padding:18px;margin:22px 0;">
          <p style="margin:0 0 10px;color:#888;">Referencia</p>
          <p style="margin:0 0 16px;font-size:20px;font-weight:800;">#${venta.id}</p>

          <p style="margin:0 0 8px;"><strong>Vehículo:</strong> ${vehiculo}</p>
          <p style="margin:0 0 8px;"><strong>Cantidad:</strong> ${venta.cantidad} unidad(es)</p>
          <p style="margin:0 0 8px;"><strong>Total:</strong> ${Number(venta.total || 0).toLocaleString("es-ES")} €</p>
          <p style="margin:0;"><strong>Fecha:</strong> ${fecha}</p>
        </div>

        <p style="color:#aaa;line-height:1.5;">Nos pondremos en contacto contigo si necesitamos documentación adicional o para coordinar la entrega.</p>
        <p style="color:#666;font-size:0.85rem;margin-top:24px;">Gracias por confiar en IAUTO.</p>
      </div>
    `,
  });
}

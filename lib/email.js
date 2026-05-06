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
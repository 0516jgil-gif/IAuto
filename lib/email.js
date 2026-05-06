import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail", // o "hotmail", "yahoo", etc.
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendVerificationEmail(toEmail, code, nombre) {
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
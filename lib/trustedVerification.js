import crypto from "crypto";

const COOKIE_NAME = "iauto_trusted_verification";
const TRUST_MS = 30 * 60 * 1000;

function getSecret() {
  return process.env.TRUSTED_VERIFICATION_SECRET || process.env.NEXTAUTH_SECRET || process.env.DATABASE_URL || "iauto-dev-secret";
}

function sign(payload) {
  return crypto.createHmac("sha256", getSecret()).update(payload).digest("base64url");
}

function encode(value) {
  const payload = Buffer.from(JSON.stringify(value)).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

function decode(token) {
  if (!token) return null;

  const [payload, signature] = token.split(".");
  if (!payload || !signature || sign(payload) !== signature) return null;

  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
  } catch {
    return null;
  }
}

export function isTrustedVerification(req, email, tipo) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  const data = decode(token);

  if (!data || data.email !== email || data.tipo !== tipo) return false;
  return Date.now() - data.verifiedAt < TRUST_MS;
}

export function setTrustedVerificationCookie(res, email, tipo) {
  res.cookies.set({
    name: COOKIE_NAME,
    value: encode({ email, tipo, verifiedAt: Date.now() }),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: TRUST_MS / 1000,
  });
}

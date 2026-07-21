import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "crypto";

export const ADMIN_SESSION_COOKIE = "optrack_admin_session";
const ADMIN_SESSION_TTL_SECONDS = 60 * 60 * 12;

function getSessionSecret() {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.DATABASE_URL_UNPOOLED ||
    process.env.DATABASE_URL ||
    "optrack-admin-dev-secret"
  );
}

function toBase64Url(input) {
  return Buffer.from(input).toString("base64url");
}

function fromBase64Url(input) {
  return Buffer.from(input, "base64url").toString("utf8");
}

function sign(payload) {
  return createHmac("sha256", getSessionSecret()).update(payload).digest("base64url");
}

export function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password, storedHash) {
  if (!storedHash || !storedHash.includes(":")) return false;
  const [salt, hash] = storedHash.split(":");
  const candidate = scryptSync(password, salt, 64).toString("hex");

  const hashBuffer = Buffer.from(hash, "hex");
  const candidateBuffer = Buffer.from(candidate, "hex");
  if (hashBuffer.length !== candidateBuffer.length) return false;
  return timingSafeEqual(hashBuffer, candidateBuffer);
}

export function createSessionToken(email) {
  const exp = Date.now() + ADMIN_SESSION_TTL_SECONDS * 1000;
  const payload = toBase64Url(JSON.stringify({ email, exp }));
  const signature = sign(payload);
  return `${payload}.${signature}`;
}

export function verifySessionToken(token) {
  if (!token || !token.includes(".")) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  const expected = sign(payload);
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (signatureBuffer.length !== expectedBuffer.length) return null;
  if (!timingSafeEqual(signatureBuffer, expectedBuffer)) return null;

  try {
    const parsed = JSON.parse(fromBase64Url(payload));
    if (!parsed?.email || !parsed?.exp || Date.now() > parsed.exp) {
      return null;
    }
    return { email: parsed.email };
  } catch {
    return null;
  }
}

export function getSessionFromRequest(req) {
  const token = req.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  return verifySessionToken(token);
}

export function getSessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ADMIN_SESSION_TTL_SECONDS,
  };
}

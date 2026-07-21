import { ADMIN_SESSION_COOKIE, getSessionCookieOptions } from "@/lib/admin-auth";

export async function POST() {
  const res = Response.json({ ok: true });
  res.cookies.set(ADMIN_SESSION_COOKIE, "", {
    ...getSessionCookieOptions(),
    maxAge: 0,
  });
  return res;
}

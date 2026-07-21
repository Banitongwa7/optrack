import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  createSessionToken,
  getSessionCookieOptions,
  verifyPassword,
  ADMIN_SESSION_COOKIE,
} from "@/lib/admin-auth";

export async function POST(req) {
  try {
    const body = await req.json();
    const email = body?.email?.trim().toLowerCase();
    const password = body?.password;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const admin = await prisma.adminUser.findUnique({ where: { email } });
    if (!admin || !verifyPassword(password, admin.password_hash)) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    const res = NextResponse.json({ ok: true, email: admin.email });
    res.cookies.set(ADMIN_SESSION_COOKIE, createSessionToken(admin.email), getSessionCookieOptions());
    return res;
  } catch (error) {
    console.error("POST /api/admin/login failed:", error);
    return NextResponse.json({ error: "Unable to sign in." }, { status: 500 });
  }
}

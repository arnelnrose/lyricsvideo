import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { authCookieName, verifyUserToken } from "./auth";
import { prisma } from "./prisma";

export async function setAuthCookie(token) {
  const cookieStore = await cookies();
  cookieStore.set({
    name: authCookieName,
    value: token,
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.set({
    name: authCookieName,
    value: "",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
  });
}

export async function getSessionUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(authCookieName)?.value;
  if (!token) return null;

  try {
    const payload = await verifyUserToken(token);
    if (!payload?.sub) return null;
    return prisma.user.findUnique({
      where: { id: String(payload.sub) },
      select: { id: true, email: true, createdAt: true },
    });
  } catch {
    return null;
  }
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

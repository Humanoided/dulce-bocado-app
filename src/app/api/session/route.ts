import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const { idToken } = await req.json();
  // (Dev) Aún no verificamos con Firebase Admin. Guardamos el token como "sesión".
  const cookieStore = await cookies();
  cookieStore.set("sb_session", idToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 días
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("sb_session");
  return NextResponse.json({ ok: true });
}

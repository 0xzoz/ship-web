import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const sessionCookieNames = [
  "__Secure-authjs.session-token",
  "authjs.session-token",
  "__Secure-next-auth.session-token",
  "next-auth.session-token",
];

export function middleware(request: NextRequest) {
  const hasSession = sessionCookieNames.some(
    (name) => request.cookies.get(name)?.value
  );

  if (!hasSession) {
    const url = new URL("/login", request.nextUrl.origin);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/settings/:path*"],
};

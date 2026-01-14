import { NextResponse } from "next/server";
import { auth } from "./auth";

export default auth((req) => {
  if (!req.auth) {
    const url = new URL("/login", req.nextUrl.origin);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/settings/:path*"],
};

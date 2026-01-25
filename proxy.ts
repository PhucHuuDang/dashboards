import { NextRequest, NextResponse } from "next/server";

import { ROUTES } from "@/constant/routes";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = ROUTES.LOCATIONS;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};

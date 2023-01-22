import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  // Token Will Exists If The User Is Logged In

  const token = await getToken({ req, secret: process.env.JWT_SECRET });

  if (typeof window === "undefined") {
    console.log("running on server");
  } else {
    console.log("running on client");
  }
  const { pathname } = req.nextUrl;

  // Allow The Request If The Following is True
  // 1 - The Token Exits
  // 2 - It's A Request for next-auth session and provider fetching
  if (pathname.includes("/api/auth") || token) {
    console.log("WE ARE HAVING TOKEN");

    return NextResponse.next();
  }
  if (!token && pathname != "/login") {
    console.log("WE DON'T HAVE TOKEN");

    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

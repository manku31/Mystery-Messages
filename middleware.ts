import { NextResponse, NextRequest } from "next/server";
export { default } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  /*  If user is lockedIn
   *  - check if url start with /sign-in, /sign-up, / or /verify
   *    - redirect to dashboard
   *  Else user is not lockedIn
   *  - check if url start with /dashboard
   *    - redirect to dashboard
   */
  if (token) {
    if (
      url.pathname.startsWith("/signin") ||
      url.pathname.startsWith("/signup") ||
      url.pathname.startsWith("/verify")
    ) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } else if (url.pathname === "/dashboard") {
      // If user is already on the dashboard, don't redirect
      return NextResponse.next();
    } else if (url.pathname === "/") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  } else {
    if (url.pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }
  }
}

// middleware is only used in pages
export const config = {
  matcher: ["/signin", "/signup", "/", "/dashboard/:path*", "/verify/:path*"],
};

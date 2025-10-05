import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
export { default } from "next-auth/middleware";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  //public pages anyone can use
  const isPublicRoute =
    url.pathname === "/" ||
    url.pathname.startsWith("/products") || // product listing or product detail pages
    url.pathname.startsWith("/api/products") || // product fetching API
    url.pathname.startsWith("/sign-in") ||
    url.pathname.startsWith("/sign-up") ||
    url.pathname.startsWith("/verify");

  if (isPublicRoute) {
    return NextResponse.next();
  }

  //Auth required pages
  const requiresAuth =
    url.pathname.startsWith("/cart") ||
    url.pathname.startsWith("/api/cart") ||
    url.pathname.startsWith("/checkout") ||
    url.pathname.startsWith("/api/orders") ||
    url.pathname.startsWith("/dashboard");

  if (requiresAuth && !token) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }


  //Admin routes
  const isAdminRoute = 
  url.pathname.startsWith("/admin") || 
  url.pathname.startsWith("/api/admin")

  if(isAdminRoute){
    if(!token){
      return NextResponse.redirect(new URL("/sign-in", request.url))
    }

    if(token.role !== "admin"){
      return NextResponse.json({
        success:false,
        message: "Unauthorized : Admins only"
      },{status: 403})
    }
  }


  //sign-in redirect
  if (
    token &&
    (url.pathname.startsWith("/sign-in") ||
      url.pathname.startsWith("/sign-up") ||
      url.pathname.startsWith("/verify") ||
      url.pathname.startsWith("/"))
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!token && url.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  //allow everything else
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/sign-in", "/sign-up", "/", "/verify/:path*", "/dashboard/:path*"],
};

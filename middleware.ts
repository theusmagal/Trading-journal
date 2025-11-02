// middleware.ts (project root)
export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/dashboard/:path*",   // protect dashboard and all its subpaths
    "/settings/:path*",    // protect user settings
    "/billing/:path*",     // protect billing pages
    "/me/:path*",          // protect user profile section (optional)
  ],
};
export { default } from "next-auth/middleware";

export const config = {
    matcher: ["/dashboard/:path*", "/", "/inbox/:path*", "/projects/:path*"],
};
import { auth } from "./auth";

export default auth(async (req) => {
  const { nextUrl } = req;

  // Protect all routes under /admin
  if (nextUrl.pathname.startsWith("/admin")) {
    const role = req.auth?.user?.role;
    if (role !== "admin") {
      return Response.redirect(new URL("/403", nextUrl));
    }
  }

  // Allow everything else
});

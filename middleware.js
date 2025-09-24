import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    const { nextUrl } = req;

    // Protect all routes under /admin
    if (nextUrl.pathname.startsWith("/admin")) {
      const role = req.nextauth.token?.role;
      if (role !== "admin") {
        return Response.redirect(new URL("/403", nextUrl));
      }
    }

    // Allow everything else
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to admin routes only for admin users
        if (req.nextUrl.pathname.startsWith("/admin")) {
          return token?.role === "admin";
        }
        // Allow all other routes
        return true;
      },
    },
  }
);

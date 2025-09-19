import { auth } from "@/auth";

export default async function AdminHome() {
  const session = await auth();
  if (!session || session.user.role !== "admin") {
    // This is double-safety; middleware already redirects.
    return null;
  }
  return <div className="...">Admin Dashboard</div>;
}

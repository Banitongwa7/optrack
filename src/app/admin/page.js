import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_SESSION_COOKIE, verifySessionToken } from "@/lib/admin-auth";
import AdminClient from "@/components/admin/AdminClient";

export const metadata = {
  title: "Administration",
  description: "Manage opportunities data",
};

export default function AdminPage() {
  const token = cookies().get(ADMIN_SESSION_COOKIE)?.value;
  const session = verifySessionToken(token);

  if (!session) {
    redirect("/admin/login");
  }

  return <AdminClient email={session.email} />;
}

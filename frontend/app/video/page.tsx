import { redirect } from "next/navigation";

import { DashboardPage } from "@/components/pages/dashboard-page";
import { getSessionUser } from "@/lib/session";

export default async function VideoRoutePage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  return <DashboardPage user={user} />;
}

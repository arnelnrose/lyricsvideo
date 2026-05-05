import { redirect } from "next/navigation";

import { LoginPage } from "@/components/pages/login-page";
import { getSessionUser } from "@/lib/session";

export default async function LoginRoutePage() {
  const user = await getSessionUser();
  if (user) redirect("/video");
  return <LoginPage />;
}

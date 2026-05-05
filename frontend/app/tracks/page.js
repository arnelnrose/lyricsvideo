import { redirect } from "next/navigation";

import { TracksPage } from "@/components/pages/tracks-page";
import { getSessionUser } from "@/lib/session";

export default async function TracksRoutePage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  return <TracksPage user={user} />;
}

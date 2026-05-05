import { redirect } from "next/navigation";

import { StudioPage } from "@/components/pages/studio-page";
import { getSessionUser } from "@/lib/session";

export default async function OutputLyricsRoutePage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  return <StudioPage user={user} />;
}

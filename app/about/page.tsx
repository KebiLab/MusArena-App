import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { AboutScreen } from "@/components/screens/AboutScreen";

export default async function AboutPage() {
  const user = await getSession();
  if (!user) redirect("/sign-in");
  return <AboutScreen user={user} />;
}

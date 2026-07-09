import { redirect } from "next/navigation";
import { LoadingScreen } from "@/components/screens/LoadingScreen";
import { getSession } from "@/lib/session";

export default async function LoadingPage() {
  const user = await getSession();
  if (user) redirect("/home");
  return <LoadingScreen />;
}

import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { UploadScreen } from "@/components/screens/UploadScreen";

export default async function UploadPage() {
  const user = await getSession();
  if (!user) redirect("/sign-in");
  return <UploadScreen />;
}

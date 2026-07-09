import { SignInForm } from "@/components/screens/SignInForm";
import { SignInHero } from "@/components/screens/SignInHero";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function SignInPage() {
  const user = await getSession();
  if (user) redirect("/home");

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-bg text-fg">
      <SignInHero />
      <div className="flex-1 overflow-y-auto px-6 pt-4 pb-6">
        <div className="mx-auto w-full max-w-sm">
          <SignInForm />
        </div>
      </div>
    </div>
  );
}

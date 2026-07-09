import { RegisterForm } from "@/components/screens/RegisterForm";
import { SignInHero } from "@/components/screens/SignInHero";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function RegisterPage() {
  const user = await getSession();
  if (user) redirect("/home");

  return (
    <div className="min-h-screen bg-bg text-fg">
      <SignInHero />
      <div className="px-6 pt-6">
        <RegisterForm />
      </div>
    </div>
  );
}

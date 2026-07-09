"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useActionState } from "react";
import { signInAction } from "@/lib/actions/auth";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";

export function SignInForm() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(signInAction, {});

  useEffect(() => {
    if (state?.success) router.push("/home");
  }, [state, router]);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <h1 className="text-2xl font-bold">С возвращением</h1>
      <Input
        name="email"
        type="email"
        label="Email"
        placeholder="you@example.com"
        autoComplete="email"
        className="rounded-2xl"
        required
      />
      <Input
        name="password"
        type="password"
        label="Пароль"
        placeholder="••••••••"
        autoComplete="current-password"
        className="rounded-2xl"
        required
      />
      {state?.error && <p className="text-sm text-red-500">{state.error}</p>}
      <div className="mt-2 flex flex-col gap-4">
        <Button type="submit" size="lg" fullWidth className="rounded-2xl" disabled={pending}>
          {pending ? "Входим..." : "Sign in"}
        </Button>
        <p className="text-center text-sm text-muted">
          Нет аккаунта?{" "}
          <Link href="/register" className="font-semibold text-fg underline">
            Зарегистрироваться
          </Link>
        </p>
      </div>
    </form>
  );
}

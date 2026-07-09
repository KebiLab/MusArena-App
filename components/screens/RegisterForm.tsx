"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useActionState } from "react";
import { signUpAction } from "@/lib/actions/auth";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";

export function RegisterForm() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(signUpAction, {});

  useEffect(() => {
    if (state?.success) router.push("/home");
  }, [state, router]);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Создать аккаунт</h1>
      <Input
        name="username"
        type="text"
        label="Никнейм"
        placeholder="musiclover"
        autoComplete="username"
      />
      <Input
        name="email"
        type="email"
        label="Email"
        placeholder="you@example.com"
        autoComplete="email"
        required
      />
      <Input
        name="password"
        type="password"
        label="Пароль"
        placeholder="минимум 6 символов"
        autoComplete="new-password"
        required
      />
      {state?.error && <p className="text-sm text-red-500">{state.error}</p>}
      <div className="mt-2 flex flex-col gap-3">
        <Button type="submit" size="lg" fullWidth disabled={pending}>
          {pending ? "Регистрация..." : "Register"}
        </Button>
        <p className="text-center text-sm text-muted">
          Уже есть аккаунт?{" "}
          <Link href="/sign-in" className="font-semibold text-fg underline">
            Войти
          </Link>
        </p>
      </div>
    </form>
  );
}

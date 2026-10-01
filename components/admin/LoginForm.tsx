"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useLogin } from "@/hooks/useAuth";
import { toFriendlyError } from "@/lib/errors";
import { ApiError } from "@/services/api";

const fieldClass =
  "w-full rounded-xs border border-line-input bg-white px-4 py-3.5 text-[17px] outline-none transition " +
  "focus:border-gold focus:shadow-[0_0_0_3px_rgba(156,119,38,.12)] disabled:opacity-60";

const labelClass = "mb-2 block text-[13px] tracking-[0.16em] text-label uppercase";

export function LoginForm({ sessionExpired }: { sessionExpired: boolean }) {
  const router = useRouter();
  const login = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const succeeded = login.isSuccess;
  const busy = login.isPending || succeeded;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    login.mutate(
      { email: email.trim(), password },
      { onSuccess: () => router.replace("/admin") },
    );
  }

  const error = login.error ? describeLoginError(login.error) : null;

  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-16">
      <div className="w-full max-w-[440px] animate-fade-in border border-line-strong bg-ivory px-[clamp(24px,6vw,44px)] py-11 shadow-[0_20px_44px_rgba(36,31,26,.07)]">
        <Image src="/images/logo.png" alt="Tuia Joias" width={96} height={58} className="mx-auto" preload />
        <div className="mt-7 mb-8 text-center">
          <p className="m-0 mb-2 text-[12.5px] tracking-[0.2em] text-label uppercase">Acesso restrito</p>
          <h1 className="m-0 font-serif text-[34px] leading-tight font-normal">Painel do portfólio</h1>
        </div>

        {sessionExpired && !error && !succeeded && (
          <p className="mb-6 border border-gold-pale bg-gold-wash px-4 py-3 text-[15px] text-ink-soft" role="status">
            Sua sessão expirou. Entre novamente.
          </p>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="email" className={labelClass}>
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="username"
            inputMode="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={busy}
            className={`${fieldClass} mb-6`}
          />

          <label htmlFor="password" className={labelClass}>
            Senha
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={busy}
            className={`${fieldClass} mb-7`}
          />

          {error && (
            <div className="mb-6 border-l-2 border-danger bg-white px-4 py-3 text-[15px] text-danger" role="alert">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={busy || !email.trim() || !password}
            className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-xs border-0 bg-ink px-6 py-4 text-[17px] font-medium tracking-[0.02em] text-ivory transition-colors hover:bg-gold disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-ink"
          >
            {login.isPending && <Spinner />}
            {succeeded ? "Entrando no painel…" : login.isPending ? "Entrando…" : "Entrar"}
          </button>
        </form>
      </div>
    </main>
  );
}

function describeLoginError(error: unknown): string {
  if (error instanceof ApiError && error.isUnauthorized) return "Email ou senha incorretos.";
  return toFriendlyError(error).message;
}

function Spinner() {
  return (
    <span
      className="h-4 w-4 animate-spin rounded-full border-2 border-ivory/30 border-t-ivory"
      aria-hidden
    />
  );
}

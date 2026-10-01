"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useSyncExternalStore, type ReactNode } from "react";
import { authKeys, AdminSessionContext, type AdminSession } from "@/hooks/useAuth";
import { clearAuthToken, readAuthToken } from "@/lib/auth-cookie";
import { toFriendlyError } from "@/lib/errors";
import { getMe } from "@/services/auth";

const noopSubscribe = () => () => {};

/**
 * Garante uma sessão válida antes de mostrar o painel: lê o token do cookie e
 * confirma com GET /auth/me. Sem token, volta ao login (o proxy normalmente
 * já faz isso antes de a página carregar).
 */
export function AdminSessionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const token = useSyncExternalStore(noopSubscribe, readAuthToken, () => null);
  const hydrated = useSyncExternalStore(noopSubscribe, () => true, () => false);

  const me = useQuery({
    queryKey: authKeys.me,
    queryFn: () => getMe(token!),
    enabled: !!token,
    staleTime: 5 * 60_000,
  });

  useEffect(() => {
    if (hydrated && !token) router.replace("/admin/login");
  }, [hydrated, token, router]);

  const logout = useCallback(() => {
    clearAuthToken();
    queryClient.clear();
    router.replace("/admin/login");
  }, [queryClient, router]);

  const session = useMemo<AdminSession | null>(
    () => (token && me.data ? { token, user: me.data, logout } : null),
    [token, me.data, logout],
  );

  if (me.isError) {
    return (
      <SessionScreen>
        <p className="m-0 mb-5 text-body">{toFriendlyError(me.error).message}</p>
        <button
          type="button"
          onClick={() => me.refetch()}
          className="cursor-pointer rounded-xs border-0 bg-ink px-6 py-3 text-[15px] text-ivory transition-colors hover:bg-gold"
        >
          Tentar de novo
        </button>
      </SessionScreen>
    );
  }

  if (!session) {
    return (
      <SessionScreen>
        <p className="m-0 text-body-muted" role="status">
          Carregando o painel…
        </p>
      </SessionScreen>
    );
  }

  return <AdminSessionContext.Provider value={session}>{children}</AdminSessionContext.Provider>;
}

function SessionScreen({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 text-center">
      <div>
        <div className="mx-auto mb-6 h-3 w-3 rotate-45 bg-gold-soft" aria-hidden />
        {children}
      </div>
    </main>
  );
}

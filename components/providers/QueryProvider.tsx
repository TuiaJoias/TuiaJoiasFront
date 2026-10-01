"use client";

import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { clearAuthToken } from "@/lib/auth-cookie";
import { ApiError } from "@/services/api";

/** Erros 4xx (credencial, validação, não encontrado) não melhoram com nova tentativa. */
function shouldRetry(failureCount: number, error: Error): boolean {
  if (error instanceof ApiError && error.status >= 400 && error.status < 500) return false;
  return failureCount < 2;
}

/**
 * Token recusado pela API (expirado, revogado, usuário removido): encerra a
 * sessão e volta ao login. O login marca `meta.skipAuthRedirect`, porque lá o
 * 401 significa apenas "senha errada".
 */
function handleUnauthorized(error: Error, meta?: Record<string, unknown>): void {
  if (!(error instanceof ApiError) || !error.isUnauthorized || meta?.skipAuthRedirect) return;
  clearAuthToken();
  window.location.replace("/admin/login?sessao=expirada");
}

export function QueryProvider({ children }: { children: ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: (error, query) => handleUnauthorized(error, query.meta),
        }),
        mutationCache: new MutationCache({
          onError: (error, _variables, _context, mutation) =>
            handleUnauthorized(error, mutation.meta),
        }),
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            refetchOnWindowFocus: false,
            retry: shouldRetry,
          },
          mutations: { retry: false },
        },
      }),
  );

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

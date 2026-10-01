"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createContext, useContext } from "react";
import { saveAuthToken } from "@/lib/auth-cookie";
import { login } from "@/services/auth";
import type { AuthUser, LoginInput } from "@/types/auth";

export interface AdminSession {
  token: string;
  user: AuthUser;
  logout: () => void;
}

export const AdminSessionContext = createContext<AdminSession | null>(null);

/** Sessão do painel. Só pode ser usado dentro de <AdminSessionProvider>. */
export function useAdminSession(): AdminSession {
  const session = useContext(AdminSessionContext);
  if (!session) throw new Error("useAdminSession precisa estar dentro de <AdminSessionProvider>.");
  return session;
}

export const authKeys = { me: ["auth", "me"] as const };

/** Login: guarda o token no cookie e já deixa o usuário no cache. */
export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: LoginInput) => login(input),
    // 401 aqui é "senha errada", não sessão expirada.
    meta: { skipAuthRedirect: true },
    onSuccess: (response) => {
      saveAuthToken(response.accessToken, response.expiresAt);
      queryClient.setQueryData(authKeys.me, response.user);
    },
  });
}

import type { AuthUser, LoginInput, LoginResponse } from "@/types/auth";
import { apiFetch } from "./api";

export function login(input: LoginInput): Promise<LoginResponse> {
  return apiFetch<LoginResponse>("/auth/login", { method: "POST", body: input });
}

/** Valida o token e retorna o administrador logado. */
export function getMe(token: string): Promise<AuthUser> {
  return apiFetch<AuthUser>("/auth/me", { token });
}

import { env } from "@/lib/env";
import type { ApiErrorBody } from "@/types/api";

/** Status usado quando a requisição nem chegou ao servidor. */
export const NETWORK_ERROR_STATUS = 0;

/**
 * Erro normalizado de qualquer chamada à API.
 * `message` é a mensagem principal do backend (já em português) e `details`
 * a lista de problemas de validação, quando houver. A tradução para texto
 * amigável na interface fica em lib/errors.ts.
 */
export class ApiError extends Error {
  readonly status: number;
  readonly details: string[];

  constructor(status: number, message: string, details: string[] = [], options?: ErrorOptions) {
    super(message, options);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }

  static fromResponse(status: number, body: unknown): ApiError {
    const { message, error, details } = (typeof body === "object" && body ? body : {}) as ApiErrorBody;
    // Respostas que não vêm da API (ex.: 404 da própria Vercel) podem trazer objetos aqui.
    const text = (value: unknown) => (typeof value === "string" && value ? value : undefined);
    const list = (Array.isArray(message) ? message : Array.isArray(details) ? details : []).filter(
      (item): item is string => typeof item === "string",
    );
    if (Array.isArray(message)) {
      return new ApiError(status, list[0] ?? `Erro ${status}`, list.slice(1));
    }
    return new ApiError(status, text(message) ?? text(error) ?? `Erro ${status}`, list);
  }

  static network(cause?: unknown): ApiError {
    return new ApiError(NETWORK_ERROR_STATUS, "Não foi possível conectar ao servidor.", [], { cause });
  }

  get isNetworkError(): boolean {
    return this.status === NETWORK_ERROR_STATUS;
  }

  get isUnauthorized(): boolean {
    return this.status === 401;
  }
}

export interface ApiRequestOptions extends Omit<RequestInit, "body"> {
  /** Objeto serializado como JSON, ou FormData enviado como multipart. */
  body?: unknown;
  /** JWT do administrador; vira `Authorization: Bearer <token>`. */
  token?: string | null;
}

export function apiUrl(path: string): string {
  return `${env.apiUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export function parseJson(text: string, contentType: string | null): unknown {
  if (!text) return undefined;
  if (!contentType?.includes("application/json")) return text;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function apiFetch<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { body, token, headers: initHeaders, ...init } = options;
  const headers = new Headers(initHeaders);
  headers.set("Accept", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  let payload: BodyInit | undefined;
  if (body instanceof FormData) {
    payload = body; // o navegador define o boundary do multipart
  } else if (body !== undefined) {
    headers.set("Content-Type", "application/json");
    payload = JSON.stringify(body);
  }

  let res: Response;
  try {
    res = await fetch(apiUrl(path), { ...init, headers, body: payload });
  } catch (cause) {
    if (init.signal?.aborted) throw cause;
    throw ApiError.network(cause);
  }

  const data = parseJson(await res.text(), res.headers.get("content-type"));
  if (!res.ok) throw ApiError.fromResponse(res.status, data);
  return data as T;
}

import type { Paginated } from "@/types/api";
import type {
  CreateWorkInput,
  PublicWork,
  PublicWorksQuery,
  ReorderWorksInput,
  UpdateWorkInput,
  UploadPurpose,
  UploadTicket,
  Work,
  WorkStats,
} from "@/types/work";
import { apiFetch, type ApiRequestOptions } from "./api";
import { putToStorage } from "./upload";

type ProgressHandler = (percent: number) => void;

// ---- Público -------------------------------------------------------------

export function listPublicWorks(
  query: PublicWorksQuery = {},
  init?: Omit<ApiRequestOptions, "body">,
): Promise<Paginated<PublicWork>> {
  const params = new URLSearchParams();
  if (query.category) params.set("category", query.category);
  if (query.page) params.set("page", String(query.page));
  if (query.limit) params.set("limit", String(query.limit));
  const qs = params.size ? `?${params}` : "";
  return apiFetch<Paginated<PublicWork>>(`/works${qs}`, init);
}

// ---- Painel (JWT) --------------------------------------------------------

export function listAdminWorks(token: string): Promise<Work[]> {
  return apiFetch<Work[]>("/admin/works", { token });
}

export function getWorkStats(token: string): Promise<WorkStats> {
  return apiFetch<WorkStats>("/admin/works/stats", { token });
}

/**
 * Etapas 1 e 2 do upload direto: a API valida tipo, tamanho e limite e devolve
 * uma URL assinada; o navegador envia a foto direto ao Supabase Storage.
 * Retorna o caminho temporário para a etapa 3 (criar ou atualizar o trabalho).
 */
async function sendPhoto(
  token: string,
  file: File,
  purpose: UploadPurpose,
  onProgress?: ProgressHandler,
): Promise<string> {
  const ticket = await apiFetch<UploadTicket>("/admin/works/uploads", {
    method: "POST",
    token,
    body: { contentType: file.type, size: file.size, purpose },
  });
  await putToStorage(ticket.uploadUrl, file, { onProgress });
  return ticket.uploadPath;
}

/** Etapa 3: a API lê a foto enviada, otimiza (WebP) e cria o trabalho. */
export async function createWork(
  token: string,
  input: CreateWorkInput,
  onProgress?: ProgressHandler,
): Promise<Work> {
  const { file, ...fields } = input;
  const uploadPath = await sendPhoto(token, file, "create", onProgress);
  return apiFetch<Work>("/admin/works", {
    method: "POST",
    token,
    body: { ...fields, uploadPath },
  });
}

export async function updateWork(
  token: string,
  id: number,
  input: UpdateWorkInput,
  onProgress?: ProgressHandler,
): Promise<Work> {
  const { file, ...fields } = input;
  const uploadPath = file ? await sendPhoto(token, file, "replace", onProgress) : undefined;
  return apiFetch<Work>(`/admin/works/${id}`, {
    method: "PATCH",
    token,
    body: uploadPath ? { ...fields, uploadPath } : fields,
  });
}

export function setWorkFavorite(token: string, id: number, isFavorite: boolean): Promise<Work> {
  return apiFetch<Work>(`/admin/works/${id}/favorite`, {
    method: "PATCH",
    token,
    body: { isFavorite },
  });
}

export function setWorkPublished(token: string, id: number, isPublished: boolean): Promise<Work> {
  return apiFetch<Work>(`/admin/works/${id}/publish`, {
    method: "PATCH",
    token,
    body: { isPublished },
  });
}

export function reorderWorks(token: string, input: ReorderWorksInput): Promise<Work[]> {
  return apiFetch<Work[]>("/admin/works/reorder", { method: "PATCH", token, body: input });
}

export function deleteWork(token: string, id: number): Promise<void> {
  return apiFetch<void>(`/admin/works/${id}`, { method: "DELETE", token });
}

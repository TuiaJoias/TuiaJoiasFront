import type { Category } from "@/types/category";
import { apiFetch, type ApiRequestOptions } from "./api";

/** GET /categories — pública, na ordem de criação. */
export function listCategories(init?: Omit<ApiRequestOptions, "body">): Promise<Category[]> {
  return apiFetch<Category[]>("/categories", init);
}

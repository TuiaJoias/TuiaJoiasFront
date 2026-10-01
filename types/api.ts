/**
 * Corpo de erro da TuiaJoiasApi (filtro global do backend):
 * { statusCode, error, message, details?, path, timestamp }.
 * `details` só vem em erros de validação.
 */
export interface ApiErrorBody {
  statusCode?: number;
  error?: string;
  message?: string | string[];
  details?: string[];
  path?: string;
  timestamp?: string;
}

/** Resposta paginada de GET /works. */
export interface Paginated<T> {
  items: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

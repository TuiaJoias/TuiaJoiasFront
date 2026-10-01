/**
 * Variáveis de ambiente públicas do frontend.
 *
 * O Next.js só embute no bundle as variáveis NEXT_PUBLIC_* acessadas de forma
 * literal (process.env.NOME), por isso cada uma é lida explicitamente aqui.
 * Nenhum segredo deve passar por este arquivo: tudo que está aqui vai para o
 * navegador.
 */

const ENV_HINT = "Copie .env.example para .env.local e preencha o valor.";

function requiredUrl(name: string, value: string | undefined): string {
  const trimmed = value?.trim();
  if (!trimmed) {
    throw new Error(`Variável de ambiente ${name} não definida. ${ENV_HINT}`);
  }
  try {
    new URL(trimmed);
  } catch {
    throw new Error(`Variável de ambiente ${name} não é uma URL válida: "${trimmed}".`);
  }
  return trimmed.replace(/\/+$/, "");
}

function positiveNumber(name: string, value: string | undefined, fallback: number): number {
  const trimmed = value?.trim();
  if (!trimmed) return fallback;
  const parsed = Number(trimmed);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error(`Variável de ambiente ${name} deve ser um número positivo, recebido "${trimmed}".`);
  }
  return parsed;
}

export const env = {
  /** URL base da API NestJS (TuiaJoiasApi), sem barra no final. */
  apiUrl: requiredUrl("NEXT_PUBLIC_API_URL", process.env.NEXT_PUBLIC_API_URL),
  /** Limite por foto usado na validação imediata do upload (o backend revalida). */
  maxFileSizeMb: positiveNumber(
    "NEXT_PUBLIC_MAX_FILE_SIZE_MB",
    process.env.NEXT_PUBLIC_MAX_FILE_SIZE_MB,
    25,
  ),
} as const;

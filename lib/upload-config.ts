import { env } from "./env";

/**
 * Formatos aceitos no upload (MIME → extensões).
 * Para suportar HEIC/HEIF no futuro, basta incluir aqui
 * ("image/heic": [".heic"], "image/heif": [".heif"]) depois que o backend aceitar.
 */
export const ACCEPTED_IMAGE_TYPES: Readonly<Record<string, readonly string[]>> = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
};

export const ACCEPTED_MIME_TYPES = Object.keys(ACCEPTED_IMAGE_TYPES);

/**
 * Valor para o atributo `accept` do <input type="file">. Sem HEIC na lista,
 * o iPhone converte a foto para JPEG automaticamente ao enviar.
 */
export const ACCEPT_ATTRIBUTE = [
  ...ACCEPTED_MIME_TYPES,
  ...Object.values(ACCEPTED_IMAGE_TYPES).flat(),
].join(",");

export const MAX_FILE_SIZE_MB = env.maxFileSizeMb;

export interface UploadLimits {
  maxFileSizeMb: number;
  acceptedMimeTypes: readonly string[];
}

/** Valores locais, usados até o painel receber os limites reais de GET /admin/works/stats. */
export const DEFAULT_UPLOAD_LIMITS: UploadLimits = {
  maxFileSizeMb: MAX_FILE_SIZE_MB,
  acceptedMimeTypes: ACCEPTED_MIME_TYPES,
};

/**
 * Validação imediata no navegador (o backend valida de novo, sempre).
 * Retorna a mensagem de erro, ou null se o arquivo pode ser enviado.
 */
export function validateImageFile(file: File, limits: UploadLimits): string | null {
  if (!limits.acceptedMimeTypes.includes(file.type)) {
    return "Formato de arquivo não permitido. Envie JPG, PNG ou WEBP.";
  }
  if (file.size > limits.maxFileSizeMb * 1024 * 1024) {
    return `Arquivo excede ${limits.maxFileSizeMb} MB.`;
  }
  return null;
}

import { ApiError } from "./api";

export interface StorageUploadOptions {
  /** Progresso do envio, de 0 a 100. */
  onProgress?: (percent: number) => void;
  signal?: AbortSignal;
}

interface StorageErrorBody {
  statusCode?: string;
  error?: string;
  message?: string;
}

/** Erros do Supabase Storage chegam como 400 com o código real em `statusCode`. */
function storageError(status: number, body: StorageErrorBody | null): ApiError {
  const code = body?.statusCode ?? String(status);
  if (code === "413") return new ApiError(400, "A foto é maior que o limite permitido.");
  if (code === "415") return new ApiError(400, "Formato de arquivo não permitido. Envie JPG, PNG ou WEBP.");
  return new ApiError(status || 502, "Não foi possível enviar a foto. Tente novamente.");
}

/**
 * Envia o arquivo direto para o Supabase Storage, na URL assinada gerada pela
 * API (o token já vem na URL; nenhuma chave fica no navegador). A foto não
 * passa pelo servidor da API, então o limite de 4,5 MB da Vercel não se aplica.
 * Usa XMLHttpRequest porque o `fetch` não informa o progresso do envio.
 */
export function putToStorage(uploadUrl: string, file: File, options: StorageUploadOptions = {}): Promise<void> {
  const { onProgress, signal } = options;

  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", uploadUrl);
    xhr.setRequestHeader("Content-Type", file.type);
    xhr.setRequestHeader("x-upsert", "false");

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress?.(Math.round((event.loaded / event.total) * 100));
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        onProgress?.(100);
        resolve();
        return;
      }
      let body: StorageErrorBody | null = null;
      try {
        body = JSON.parse(xhr.responseText) as StorageErrorBody;
      } catch {
        body = null;
      }
      reject(storageError(xhr.status, body));
    };
    xhr.onerror = () => reject(ApiError.network());
    xhr.onabort = () => reject(new DOMException("Envio cancelado.", "AbortError"));

    signal?.addEventListener("abort", () => xhr.abort(), { once: true });
    xhr.send(file);
  });
}

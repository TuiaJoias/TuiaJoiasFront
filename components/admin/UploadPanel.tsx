"use client";

import { useEffect, useRef, useState } from "react";
import { useCreateWork } from "@/hooks/useWorks";
import { friendlyMessage } from "@/lib/errors";
import { plural, titleFromFilename } from "@/lib/format";
import { DEFAULT_UPLOAD_LIMITS, validateImageFile } from "@/lib/upload-config";
import type { Category } from "@/types/category";
import type { WorkStats } from "@/types/work";
import { useFeedback } from "./FeedbackProvider";
import { UploadDropzone } from "./UploadDropzone";
import { WorkForm, type QueueItem } from "./WorkForm";

interface UploadPanelProps {
  categories: Category[];
  stats: WorkStats | undefined;
  /** Categoria do filtro ativo: vira a sugestão para as fotos novas. */
  suggestedCategoryId: number | undefined;
}

const DONE_VISIBLE_MS = 1_500;

/**
 * Upload em duas etapas: o admin solta as fotos, revisa título/categoria de
 * cada uma e só então envia. Os envios são feitos um por vez, com progresso.
 */
export function UploadPanel({ categories, stats, suggestedCategoryId }: UploadPanelProps) {
  const [items, setItems] = useState<QueueItem[]>([]);
  const [sending, setSending] = useState(false);
  const createWork = useCreateWork();
  const { notify } = useFeedback();
  const previewUrls = useRef(new Set<string>());

  const limits = stats?.upload ?? DEFAULT_UPLOAD_LIMITS;

  useEffect(() => {
    const urls = previewUrls.current;
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  function update(key: string, patch: Partial<QueueItem>) {
    setItems((current) => current.map((item) => (item.key === key ? { ...item, ...patch } : item)));
  }

  function remove(key: string) {
    setItems((current) => {
      const item = current.find((i) => i.key === key);
      if (item?.previewUrl) {
        URL.revokeObjectURL(item.previewUrl);
        previewUrls.current.delete(item.previewUrl);
      }
      return current.filter((i) => i.key !== key);
    });
  }

  function addFiles(files: File[]) {
    const added = files.map<QueueItem>((file) => {
      const error = validateImageFile(file, limits);
      const previewUrl = error ? null : URL.createObjectURL(file);
      if (previewUrl) previewUrls.current.add(previewUrl);
      return {
        key: crypto.randomUUID(),
        file,
        previewUrl,
        title: titleFromFilename(file.name),
        categoryId: suggestedCategoryId ?? "",
        description: "",
        isFavorite: false,
        status: error ? "invalid" : "ready",
        progress: 0,
        error: error ?? undefined,
      };
    });
    setItems((current) => [...current, ...added]);
  }

  const pending = items.filter((item) => item.status === "ready" || item.status === "error");
  const incomplete = pending.filter((item) => !item.title.trim() || item.categoryId === "");
  const overLimit = stats ? Math.max(pending.length - stats.remaining, 0) : 0;
  const canSend = pending.length > 0 && incomplete.length === 0 && overLimit === 0 && !sending;

  async function sendAll() {
    if (!canSend) return;
    setSending(true);
    let sent = 0;

    for (const item of pending) {
      update(item.key, { status: "uploading", progress: 0, error: undefined });
      try {
        await createWork.mutateAsync({
          input: {
            file: item.file,
            title: item.title.trim(),
            categoryId: Number(item.categoryId),
            description: item.description.trim() || undefined,
            isFavorite: item.isFavorite,
          },
          onProgress: (progress) => update(item.key, { progress }),
        });
        sent += 1;
        update(item.key, { status: "done", progress: 100 });
        window.setTimeout(() => remove(item.key), DONE_VISIBLE_MS);
      } catch (error) {
        update(item.key, { status: "error", error: friendlyMessage(error) });
      }
    }

    setSending(false);
    if (sent > 0) {
      notify(`${sent} ${plural(sent, "foto enviada", "fotos enviadas")} e publicada${sent === 1 ? "" : "s"} no site.`, "success");
    }
  }

  function clearAll() {
    items.forEach((item) => item.previewUrl && URL.revokeObjectURL(item.previewUrl));
    previewUrls.current.clear();
    setItems([]);
  }

  return (
    <section aria-label="Enviar fotos">
      <UploadDropzone
        maxFileSizeMb={limits.maxFileSizeMb}
        remaining={stats?.remaining}
        maxWorks={stats?.maxWorks}
        onFiles={addFiles}
      />

      {items.length > 0 && (
        <div className="mb-[34px] animate-fade-in border border-line-strong bg-ivory px-[clamp(16px,2.4vw,24px)] py-[22px]">
          <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="m-0 text-[12.5px] font-normal tracking-[0.18em] text-label uppercase">
              {sending ? "Enviando" : "Revise antes de enviar"}
            </h2>
            {!sending && pending.length > 0 && (
              <span className="text-[14px] text-body-muted">Título e categoria são obrigatórios.</span>
            )}
          </div>

          <ul className="m-0 list-none p-0">
            {items.map((item) => (
              <WorkForm
                key={item.key}
                item={item}
                categories={categories}
                disabled={sending}
                onChange={(patch) => update(item.key, patch)}
                onRemove={() => remove(item.key)}
              />
            ))}
          </ul>

          {overLimit > 0 && (
            <p className="m-0 mt-4 border-l-2 border-danger bg-white px-4 py-3 text-[15px] text-danger" role="alert">
              Só cabem mais {stats?.remaining} {plural(stats?.remaining ?? 0, "foto", "fotos")} (limite de{" "}
              {stats?.maxWorks}). Remova {overLimit} {plural(overLimit, "foto", "fotos")} da lista para continuar.
            </p>
          )}

          {pending.length > 0 && (
            <div className="mt-5 flex flex-wrap items-center justify-end gap-3">
              <button
                type="button"
                onClick={clearAll}
                disabled={sending}
                className="cursor-pointer rounded-xs border border-line-input bg-transparent px-5 py-3 text-[15px] text-ink-soft transition-colors hover:border-gold disabled:opacity-50"
              >
                Limpar lista
              </button>
              <button
                type="button"
                onClick={sendAll}
                disabled={!canSend}
                className="cursor-pointer rounded-xs border-0 bg-gold px-6 py-3 text-[15px] font-medium text-white shadow-[0_10px_26px_rgba(156,119,38,.22)] transition-[background,transform] duration-300 hover:-translate-y-0.5 hover:bg-gold-hover disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {sending
                  ? "Enviando…"
                  : `Enviar ${pending.length} ${plural(pending.length, "foto", "fotos")}`}
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

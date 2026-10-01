"use client";

/* eslint-disable @next/next/no-img-element -- prévia local (blob:) não passa pelo next/image */

import { fileSize } from "@/lib/format";
import type { Category } from "@/types/category";

export type QueueStatus = "invalid" | "ready" | "uploading" | "done" | "error";

export interface QueueItem {
  key: string;
  file: File;
  previewUrl: string | null;
  title: string;
  categoryId: number | "";
  description: string;
  isFavorite: boolean;
  status: QueueStatus;
  progress: number;
  error?: string;
}

interface WorkFormProps {
  item: QueueItem;
  categories: Category[];
  disabled: boolean;
  onChange: (patch: Partial<QueueItem>) => void;
  onRemove: () => void;
}

const inputClass =
  "w-full rounded-xs border border-line-field bg-white px-[11px] py-[9px] text-[15px] outline-none transition-colors focus:border-gold disabled:opacity-60";

/** Revisão de uma foto antes do envio: título, categoria, descrição e destaque. */
export function WorkForm({ item, categories, disabled, onChange, onRemove }: WorkFormProps) {
  const locked = disabled || item.status === "uploading" || item.status === "done";
  const invalid = item.status === "invalid";
  const id = `upload-${item.key}`;

  return (
    <li className="flex flex-col gap-4 border-b border-line py-4 last:border-b-0 sm:flex-row">
      <div className="relative h-[88px] w-[88px] shrink-0 overflow-hidden bg-cream-3">
        {item.previewUrl ? (
          <img src={item.previewUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-[12px] tracking-[0.1em] text-label uppercase">
            Sem prévia
          </div>
        )}
        {item.status === "done" && (
          <div className="absolute inset-0 flex items-center justify-center bg-ink/60 text-[22px] text-gold-light">
            ✓
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-2 flex items-baseline justify-between gap-3 text-[14px] text-label">
          <span className="truncate">{item.file.name}</span>
          <StatusLabel item={item} />
        </div>

        {invalid ? (
          <p className="m-0 text-[15px] text-danger">{item.error}</p>
        ) : (
          <div className="grid gap-2.5 sm:grid-cols-2">
            <div>
              <label htmlFor={`${id}-title`} className="sr-only">
                Título
              </label>
              <input
                id={`${id}-title`}
                type="text"
                value={item.title}
                maxLength={120}
                placeholder="Nome da peça"
                disabled={locked}
                onChange={(e) => onChange({ title: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor={`${id}-category`} className="sr-only">
                Categoria
              </label>
              <select
                id={`${id}-category`}
                value={item.categoryId}
                disabled={locked}
                onChange={(e) => onChange({ categoryId: e.target.value ? Number(e.target.value) : "" })}
                className={`${inputClass} cursor-pointer`}
              >
                <option value="">Selecione a categoria</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor={`${id}-description`} className="sr-only">
                Descrição (opcional)
              </label>
              <input
                id={`${id}-description`}
                type="text"
                value={item.description}
                maxLength={160}
                placeholder="Detalhe opcional, ex.: Ouro 18k · peça única"
                disabled={locked}
                onChange={(e) => onChange({ description: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>
        )}

        {item.status === "uploading" && (
          <div className="mt-3 h-[3px] overflow-hidden bg-cream-2" aria-hidden>
            <div className="h-full bg-gold transition-[width] duration-200" style={{ width: `${item.progress}%` }} />
          </div>
        )}
        {item.status === "error" && <p className="m-0 mt-2.5 text-[14.5px] text-danger">{item.error}</p>}
      </div>

      <div className="flex shrink-0 items-start gap-2 sm:flex-col sm:items-end">
        {!invalid && (
          <button
            type="button"
            onClick={() => onChange({ isFavorite: !item.isFavorite })}
            disabled={locked}
            aria-pressed={item.isFavorite}
            className={`flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-[13.5px] transition-colors disabled:cursor-default disabled:opacity-60 ${
              item.isFavorite
                ? "border-gold-soft bg-gold-soft text-ink"
                : "border-line-input bg-transparent text-body-muted hover:border-gold"
            }`}
          >
            <span aria-hidden>★</span> Destaque
          </button>
        )}
        {item.status !== "uploading" && item.status !== "done" && (
          <button
            type="button"
            onClick={onRemove}
            disabled={disabled}
            className="cursor-pointer rounded-full border border-transparent bg-transparent px-3 py-1.5 text-[13.5px] text-body-muted transition-colors hover:text-danger disabled:opacity-50"
          >
            Remover
          </button>
        )}
      </div>
    </li>
  );
}

function StatusLabel({ item }: { item: QueueItem }) {
  switch (item.status) {
    case "uploading":
      return <span className="shrink-0 text-gold">{item.progress < 100 ? `${item.progress}%` : "Otimizando…"}</span>;
    case "done":
      return <span className="shrink-0 text-gold">Enviada</span>;
    case "error":
    case "invalid":
      return <span className="shrink-0 text-danger">Não enviada</span>;
    default:
      return <span className="shrink-0">{fileSize(item.file.size)}</span>;
  }
}

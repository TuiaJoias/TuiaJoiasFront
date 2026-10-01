"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Image from "next/image";
import { useRef, useState, type KeyboardEvent, type FocusEvent, type SyntheticEvent } from "react";
import { useDeleteWork, useSetFavorite, useSetPublished, useUpdateWork } from "@/hooks/useWorks";
import { friendlyMessage } from "@/lib/errors";
import { pad2 } from "@/lib/format";
import { ACCEPT_ATTRIBUTE, DEFAULT_UPLOAD_LIMITS, validateImageFile, type UploadLimits } from "@/lib/upload-config";
import type { Category } from "@/types/category";
import type { Work } from "@/types/work";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal";
import { useFeedback } from "./FeedbackProvider";

interface WorkCardProps {
  work: Work;
  /** Posição no site (1..N), na lista completa. */
  position: number;
  categories: Category[];
  limits: UploadLimits | undefined;
  /** Primeiras fotos da grade: carregam sem esperar a rolagem. */
  eager?: boolean;
}

const fieldClass =
  "w-full rounded-xs border border-line-field bg-white px-[11px] py-[9px] text-[15px] outline-none transition-colors focus:border-gold";

/** Impede que cliques nos controles sobre a foto iniciem o arrastar. */
const stopDrag = {
  onMouseDown: (e: SyntheticEvent) => e.stopPropagation(),
  onTouchStart: (e: SyntheticEvent) => e.stopPropagation(),
  onKeyDown: (e: SyntheticEvent) => e.stopPropagation(),
};

export function WorkCard({ work, position, categories, limits, eager = false }: WorkCardProps) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } =
    useSortable({ id: work.id });

  const { notify } = useFeedback();
  const updateWork = useUpdateWork();
  const setFavorite = useSetFavorite();
  const setPublished = useSetPublished();
  const deleteWork = useDeleteWork();

  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [replaceProgress, setReplaceProgress] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onError = (error: unknown) => notify(friendlyMessage(error));

  function saveText(field: "title" | "description", event: FocusEvent<HTMLInputElement>) {
    const element = event.currentTarget;
    const value = element.value.trim();
    const current = (field === "title" ? work.title : work.description) ?? "";

    if (field === "title" && !value) {
      element.value = work.title;
      notify("O título não pode ficar vazio.");
      return;
    }
    if (value === current) return;
    const input = field === "title" ? { title: value } : { description: value || null };
    updateWork.mutate({ id: work.id, input }, { onError });
  }

  function handleTextKey(event: KeyboardEvent<HTMLInputElement>, original: string) {
    if (event.key === "Enter") event.currentTarget.blur();
    if (event.key === "Escape") {
      event.currentTarget.value = original;
      event.currentTarget.blur();
    }
  }

  function replaceImage(file: File) {
    const problem = validateImageFile(file, limits ?? DEFAULT_UPLOAD_LIMITS);
    if (problem) {
      notify(problem);
      return;
    }
    setReplaceProgress(0);
    updateWork.mutate(
      { id: work.id, input: { file }, onProgress: setReplaceProgress },
      {
        onError,
        onSuccess: () => notify("Foto substituída.", "success"),
        onSettled: () => setReplaceProgress(null),
      },
    );
  }

  function confirmDelete() {
    deleteWork.mutate(work.id, {
      onSuccess: () => {
        setConfirmingDelete(false);
        notify(`“${work.title}” foi excluída.`, "success");
      },
      onError: (error) => {
        setConfirmingDelete(false);
        onError(error);
      },
    });
  }

  const hidden = !work.isPublished;

  return (
    <article
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`flex flex-col border bg-ivory shadow-[0_2px_10px_rgba(36,31,26,.05)] transition-[box-shadow,border-color] duration-300 hover:shadow-[0_14px_30px_rgba(36,31,26,.12)] ${
        work.isFavorite ? "border-gold-soft" : "border-line-field"
      } ${isDragging ? "relative z-20 opacity-60 shadow-[0_24px_50px_rgba(36,31,26,.25)]" : ""}`}
    >
      <div
        ref={setActivatorNodeRef}
        {...attributes}
        {...listeners}
        aria-label={`Arrastar “${work.title}” (posição ${position})`}
        className="relative cursor-grab touch-manipulation bg-cream-3 outline-none focus-visible:ring-2 focus-visible:ring-gold active:cursor-grabbing"
      >
        <div className="relative aspect-square w-full overflow-hidden">
          <Image
            src={work.imageUrl}
            alt={work.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1100px) 33vw, 300px"
            loading={eager ? "eager" : "lazy"}
            draggable={false}
            className={`object-cover transition-[filter] duration-300 ${hidden ? "opacity-55 grayscale" : ""}`}
          />
        </div>

        <div className="absolute top-2.5 left-2.5 bg-ink/80 px-[9px] py-1 text-[12px] tracking-[0.12em] text-on-dark uppercase">
          {pad2(position)}
        </div>

        <button
          type="button"
          {...stopDrag}
          onClick={() => setFavorite.mutate({ id: work.id, isFavorite: !work.isFavorite }, { onError })}
          aria-pressed={work.isFavorite}
          title={work.isFavorite ? "Remover dos destaques" : "Marcar como destaque"}
          aria-label={work.isFavorite ? "Remover dos destaques" : "Marcar como destaque"}
          className={`absolute top-2 right-2 flex h-[34px] w-[34px] cursor-pointer items-center justify-center rounded-full border-0 text-[15px] transition-colors duration-200 ${
            work.isFavorite ? "bg-gold-soft text-ink" : "bg-ivory/90 text-mute-3 hover:text-gold"
          }`}
        >
          ★
        </button>

        {replaceProgress !== null && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-ink/70 text-[14px] text-on-dark">
            <span>{replaceProgress < 100 ? `Enviando ${replaceProgress}%` : "Otimizando…"}</span>
            <span className="h-[3px] w-1/2 overflow-hidden bg-on-dark/20">
              <span className="block h-full bg-gold-soft transition-[width]" style={{ width: `${replaceProgress}%` }} />
            </span>
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 flex">
          <button
            type="button"
            {...stopDrag}
            onClick={() => setPublished.mutate({ id: work.id, isPublished: hidden }, { onError })}
            aria-pressed={!hidden}
            title={hidden ? "Mostrar no site" : "Ocultar do site"}
            className="flex flex-1 cursor-pointer items-center justify-center gap-2 border-0 bg-ivory/95 p-[9px] text-[13.5px] text-ink transition-colors hover:bg-white"
          >
            <span className={`h-1.5 w-1.5 rounded-full ${hidden ? "bg-mute-3" : "bg-whatsapp"}`} aria-hidden />
            {hidden ? "Oculta" : "Visível no site"}
          </button>
          <button
            type="button"
            {...stopDrag}
            onClick={() => setConfirmingDelete(true)}
            className="cursor-pointer border-0 bg-ink/90 px-3.5 py-[9px] text-[13.5px] text-on-dark transition-colors hover:bg-danger"
          >
            Excluir
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2.5 p-3.5">
        <input
          key={`title-${work.title}`}
          type="text"
          defaultValue={work.title}
          maxLength={120}
          placeholder="Nome da peça"
          aria-label="Título"
          onBlur={(e) => saveText("title", e)}
          onKeyDown={(e) => handleTextKey(e, work.title)}
          className={fieldClass}
        />
        <select
          value={work.categoryId}
          aria-label="Categoria"
          onChange={(e) =>
            updateWork.mutate({ id: work.id, input: { categoryId: Number(e.target.value) } }, { onError })
          }
          className={`${fieldClass} cursor-pointer`}
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <input
          key={`description-${work.description ?? ""}`}
          type="text"
          defaultValue={work.description ?? ""}
          maxLength={160}
          placeholder="Detalhe (opcional)"
          aria-label="Descrição"
          onBlur={(e) => saveText("description", e)}
          onKeyDown={(e) => handleTextKey(e, work.description ?? "")}
          className={`${fieldClass} text-[14px]`}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={replaceProgress !== null}
          className="cursor-pointer self-start border-0 bg-transparent p-0 text-[13.5px] text-gold underline-offset-4 hover:text-gold-deep hover:underline disabled:opacity-50"
        >
          Trocar foto
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPT_ATTRIBUTE}
          className="sr-only"
          tabIndex={-1}
          aria-hidden
          onChange={(e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (file) replaceImage(file);
          }}
        />
      </div>

      <ConfirmDeleteModal
        title={work.title}
        open={confirmingDelete}
        pending={deleteWork.isPending}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmingDelete(false)}
      />
    </article>
  );
}

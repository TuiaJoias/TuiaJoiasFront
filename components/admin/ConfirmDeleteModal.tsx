"use client";

import { useEffect, useRef } from "react";

interface ConfirmDeleteModalProps {
  title: string;
  open: boolean;
  pending: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/** Confirmação de exclusão com <dialog> nativo (foco preso e Esc para fechar). */
export function ConfirmDeleteModal({ title, open, pending, onConfirm, onCancel }: ConfirmDeleteModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onCancel={(event) => {
        event.preventDefault();
        if (!pending) onCancel();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget && !pending) onCancel();
      }}
      aria-labelledby="confirm-delete-title"
      className="m-auto w-[min(92vw,440px)] border border-line-strong bg-ivory p-0 text-ink shadow-[0_30px_70px_rgba(36,31,26,.3)] backdrop:bg-ink/60 backdrop:backdrop-blur-[2px]"
    >
      <div className="p-[clamp(24px,5vw,34px)]">
        <h2 id="confirm-delete-title" className="m-0 mb-3 font-serif text-[28px] leading-tight font-normal">
          Excluir esta foto?
        </h2>
        <p className="m-0 mb-7 text-[16px] text-body">
          <strong className="font-medium text-ink">“{title}”</strong> será removida do site e do
          armazenamento. Essa ação não pode ser desfeita.
        </p>
        <div className="flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={pending}
            autoFocus
            className="cursor-pointer rounded-xs border border-line-input bg-transparent px-5 py-3 text-[15px] text-ink-soft transition-colors hover:border-gold disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={pending}
            className="cursor-pointer rounded-xs border-0 bg-danger px-5 py-3 text-[15px] font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {pending ? "Excluindo…" : "Excluir"}
          </button>
        </div>
      </div>
    </dialog>
  );
}

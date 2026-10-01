"use client";

import { useRef, useState, type DragEvent } from "react";
import { ACCEPT_ATTRIBUTE } from "@/lib/upload-config";

interface UploadDropzoneProps {
  maxFileSizeMb: number;
  /** Quantas fotos ainda cabem (MAX_WORKS − total). `undefined` enquanto carrega. */
  remaining: number | undefined;
  maxWorks: number | undefined;
  onFiles: (files: File[]) => void;
}

export function UploadDropzone({ maxFileSizeMb, remaining, maxWorks, onFiles }: UploadDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const full = remaining === 0;

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setDragging(false);
    if (full) return;
    const files = Array.from(event.dataTransfer.files ?? []);
    if (files.length) onFiles(files);
  }

  return (
    <label
      onDragOver={(event) => {
        event.preventDefault();
        if (!full && !dragging) setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      aria-disabled={full}
      className={`mb-[34px] block rounded-[3px] border-2 border-dashed px-[26px] py-[clamp(30px,4vw,52px)] text-center transition-colors duration-200 ${
        full
          ? "cursor-not-allowed border-line-dash bg-cream-2/60"
          : dragging
            ? "cursor-copy border-gold bg-gold-wash"
            : "cursor-pointer border-line-dash bg-ivory hover:border-gold-muted"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT_ATTRIBUTE}
        multiple
        disabled={full}
        className="sr-only"
        onChange={(event) => {
          const files = Array.from(event.target.files ?? []);
          if (files.length) onFiles(files);
          event.target.value = "";
        }}
      />
      <div className="mx-auto mb-[18px] flex h-[52px] w-[52px] rotate-45 items-center justify-center border border-gold-soft">
        <span className="-rotate-45 text-[24px] leading-none text-gold">↑</span>
      </div>

      {full ? (
        <>
          <div className="mb-1.5 font-serif text-[26px]">Limite de {maxWorks} fotos atingido</div>
          <div className="text-[16px] text-body-muted">Exclua uma foto do portfólio para enviar outra.</div>
        </>
      ) : (
        <>
          <div className="mb-1.5 font-serif text-[26px]">
            {dragging ? "Solte para adicionar" : "Arraste as fotos para cá"}
          </div>
          <div className="text-[16px] text-body-muted">
            JPG, PNG ou WEBP · até {maxFileSizeMb} MB por foto · várias de uma vez
          </div>
          {remaining !== undefined && (
            <div className="mt-1 text-[14px] text-label">
              Cabem mais {remaining} {remaining === 1 ? "foto" : "fotos"} (limite de {maxWorks})
            </div>
          )}
          <span className="mt-5 inline-block rounded-xs bg-ink px-6 py-3 text-[15px] text-ivory">
            Escolher do computador
          </span>
        </>
      )}
    </label>
  );
}

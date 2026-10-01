"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import type { PublicWork } from "@/types/work";
import { workCaption } from "./GalleryCard";

interface LightboxProps {
  works: PublicWork[];
  index: number;
  onChange: (index: number) => void;
  onClose: () => void;
}

export function Lightbox({ works, index, onChange, onClose }: LightboxProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const work = works[index];
  const count = works.length;

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") onChange((index + 1) % count);
      if (event.key === "ArrowLeft") onChange((index - 1 + count) % count);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, count, onChange, onClose]);

  if (!work) return null;

  const navButton =
    "absolute top-1/2 flex h-[52px] w-[52px] -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-ivory/30 bg-ivory/10 text-[20px] text-ivory transition-colors hover:bg-ivory/30";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={work.title}
      onClick={onClose}
      className="fixed inset-0 z-[120] flex animate-fade-in cursor-zoom-out items-center justify-center bg-[rgba(22,19,16,.94)] p-[clamp(16px,4vw,54px)] backdrop-blur-[4px]"
    >
      {count > 1 && (
        <>
          <button
            type="button"
            aria-label="Foto anterior"
            onClick={(e) => {
              e.stopPropagation();
              onChange((index - 1 + count) % count);
            }}
            className={`${navButton} left-[clamp(10px,2vw,28px)]`}
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Próxima foto"
            onClick={(e) => {
              e.stopPropagation();
              onChange((index + 1) % count);
            }}
            className={`${navButton} right-[clamp(10px,2vw,28px)]`}
          >
            ›
          </button>
        </>
      )}
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        className="absolute top-[clamp(10px,2vw,28px)] right-[clamp(10px,2vw,28px)] cursor-pointer border-0 bg-transparent text-[15px] tracking-[0.14em] text-on-dark-soft uppercase hover:text-white"
      >
        Fechar ✕
      </button>

      <figure className="m-0 flex max-w-[min(1000px,92vw)] flex-col items-center gap-4" onClick={(e) => e.stopPropagation()}>
        <Image
          key={work.id}
          src={work.imageUrl}
          alt={work.title}
          width={work.width}
          height={work.height}
          sizes="(max-width: 1100px) 92vw, 1000px"
          className="h-auto max-h-[72vh] w-auto max-w-full animate-fade-in object-contain shadow-[0_30px_70px_rgba(0,0,0,.5)]"
        />
        <figcaption className="text-center text-on-dark">
          <div className="font-serif text-[28px]">{work.title}</div>
          <div className="mt-1 text-[13px] tracking-[0.14em] text-mute-2 uppercase">
            {workCaption(work)}
            {count > 1 && ` · ${index + 1} de ${count}`}
          </div>
        </figcaption>
      </figure>
    </div>
  );
}

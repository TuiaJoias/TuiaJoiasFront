"use client";

import { useMemo, useState } from "react";
import { pad2 } from "@/lib/format";
import type { Category } from "@/types/category";
import type { PublicWork } from "@/types/work";
import { GalleryCard } from "./GalleryCard";
import { Lightbox } from "./Lightbox";

const ALL = "tudo";

interface GalleryProps {
  works: PublicWork[];
  categories: Category[];
}

/**
 * Galeria pública. Os dados chegam prontos do servidor (só trabalhos
 * publicados, na ordem definida no painel); o filtro roda no navegador.
 */
export function Gallery({ works, categories }: GalleryProps) {
  const [filter, setFilter] = useState(ALL);
  const [open, setOpen] = useState<number | null>(null);

  // Só mostra filtros de categorias que têm peças publicadas.
  const filters = useMemo(() => {
    const used = new Set(works.map((work) => work.category.id));
    return [{ slug: ALL, name: "Tudo" }, ...categories.filter((category) => used.has(category.id))];
  }, [works, categories]);

  const visible = filter === ALL ? works : works.filter((work) => work.category.slug === filter);

  return (
    <>
      <div className="mb-[34px] flex items-end justify-between gap-6 border-b border-line pb-[30px]">
        <div
          role="toolbar"
          aria-label="Filtrar peças por categoria"
          className="flex flex-wrap gap-2.5"
        >
          {filters.map((option) => {
            const active = option.slug === filter;
            return (
              <button
                key={option.slug}
                type="button"
                aria-pressed={active}
                onClick={() => {
                  setFilter(option.slug);
                  setOpen(null);
                }}
                className={`cursor-pointer rounded-full border px-5 py-2.5 text-[15px] tracking-[0.03em] transition-all duration-300 hover:border-gold ${
                  active ? "border-ink bg-ink text-ivory" : "border-line-input bg-transparent text-ink-soft"
                }`}
              >
                {option.name}
              </button>
            );
          })}
        </div>
        <div className="shrink-0 font-serif text-[clamp(46px,5vw,70px)] leading-none text-[#d9cdb6]" aria-hidden>
          {pad2(visible.length)}
        </div>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,280px),1fr))] items-start gap-[clamp(14px,1.6vw,26px)]">
        {visible.map((work, index) => (
          <GalleryCard key={work.id} work={work} eager={index < 3} onOpen={() => setOpen(index)} />
        ))}
      </div>

      {open !== null && (
        <Lightbox works={visible} index={open} onChange={setOpen} onClose={() => setOpen(null)} />
      )}
    </>
  );
}

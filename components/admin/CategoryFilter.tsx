"use client";

import type { Category } from "@/types/category";

export const ALL_CATEGORIES = "todas";

interface CategoryFilterProps {
  categories: Category[];
  selected: string;
  onSelect: (slug: string) => void;
}

/** "Todas" + categorias do backend. No celular a linha rola na horizontal. */
export function CategoryFilter({ categories, selected, onSelect }: CategoryFilterProps) {
  const options = [{ slug: ALL_CATEGORIES, name: "Todas" }, ...categories];

  return (
    <div
      role="toolbar"
      aria-label="Filtrar por categoria"
      className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0"
    >
      {options.map((option) => {
        const active = option.slug === selected;
        return (
          <button
            key={option.slug}
            type="button"
            onClick={() => onSelect(option.slug)}
            aria-pressed={active}
            className={`shrink-0 cursor-pointer rounded-full border px-[17px] py-2 text-[14.5px] whitespace-nowrap transition-all duration-200 hover:border-gold ${
              active ? "border-ink bg-ink text-ivory" : "border-line-input bg-transparent text-ink-soft"
            }`}
          >
            {option.name}
          </button>
        );
      })}
    </div>
  );
}

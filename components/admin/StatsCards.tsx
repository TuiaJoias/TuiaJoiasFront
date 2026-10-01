"use client";

import { useWorkStats } from "@/hooks/useWorks";
import { pad2, plural } from "@/lib/format";

/** Contadores do topo do painel, calculados pelo backend (GET /admin/works/stats). */
export function StatsCards() {
  const { data: stats, isError } = useWorkStats();

  const cards = [
    { value: stats?.total, label: plural(stats?.total ?? 0, "foto", "fotos") },
    { value: stats?.favorites, label: plural(stats?.favorites ?? 0, "destaque", "destaques") },
    { value: stats?.hidden, label: plural(stats?.hidden ?? 0, "oculta", "ocultas") },
  ];

  return (
    <div
      className="flex gap-px border border-line-strong bg-line-strong"
      aria-label="Resumo do portfólio"
      title={isError ? "Não foi possível carregar os números." : undefined}
    >
      {cards.map((card) => (
        <div key={card.label} className="min-w-[96px] flex-1 bg-ivory px-[22px] py-3.5 text-center">
          <div className="font-serif text-[30px] leading-none">
            {card.value === undefined ? "—" : pad2(card.value)}
          </div>
          <div className="mt-1 text-[12px] tracking-[0.14em] text-label uppercase">{card.label}</div>
        </div>
      ))}
    </div>
  );
}

"use client";

import { useState, type ReactNode } from "react";
import { useCategories } from "@/hooks/useCategories";
import { useAdminWorks, useWorkStats } from "@/hooks/useWorks";
import { toFriendlyError } from "@/lib/errors";
import { AdminHeader } from "./AdminHeader";
import { ALL_CATEGORIES, CategoryFilter } from "./CategoryFilter";
import { StatsCards } from "./StatsCards";
import { UploadPanel } from "./UploadPanel";
import { WorkGrid } from "./WorkGrid";

export function AdminDashboard() {
  const works = useAdminWorks();
  const stats = useWorkStats();
  const categories = useCategories();
  const [filter, setFilter] = useState(ALL_CATEGORIES);

  const categoryList = categories.data ?? [];
  const allWorks = works.data ?? [];
  const visible = filter === ALL_CATEGORIES ? allWorks : allWorks.filter((w) => w.category.slug === filter);
  const filterCategory = categoryList.find((c) => c.slug === filter);

  return (
    <>
      <AdminHeader />

      <main className="mx-auto w-full max-w-[1320px] px-[clamp(16px,2.5vw,26px)] pt-[clamp(24px,3vw,40px)] pb-20">
        <div className="mb-[26px] flex flex-wrap items-end justify-between gap-x-10 gap-y-[18px]">
          <div>
            <h1 className="m-0 mb-1.5 font-serif text-[clamp(30px,3.4vw,44px)] leading-[1.1] font-normal">
              Fotos do portfólio
            </h1>
            <p className="m-0 max-w-[62ch] text-[17px] text-body-muted">
              Arraste as fotos para dentro, escolha a categoria e envie. O que estiver visível aqui aparece no site.
            </p>
          </div>
          <StatsCards />
        </div>

        <UploadPanel categories={categoryList} stats={stats.data} suggestedCategoryId={filterCategory?.id} />

        <div className="mb-[26px] flex flex-wrap items-center justify-between gap-3 border-b border-line-strong pb-[18px]">
          <CategoryFilter categories={categoryList} selected={filter} onSelect={setFilter} />
          <p className="m-0 text-[14.5px] text-label">Arraste os cartões para mudar a ordem no site</p>
        </div>

        {works.isPending ? (
          <GridSkeleton />
        ) : works.isError ? (
          <StateBox title="Não foi possível carregar as fotos">
            <p className="m-0 mb-5 text-body-muted">{toFriendlyError(works.error).message}</p>
            <button
              type="button"
              onClick={() => works.refetch()}
              className="cursor-pointer rounded-xs border-0 bg-ink px-6 py-3 text-[15px] text-ivory transition-colors hover:bg-gold"
            >
              Tentar de novo
            </button>
          </StateBox>
        ) : visible.length === 0 ? (
          <StateBox title={allWorks.length ? "Nenhuma foto nesta categoria" : "Nenhuma foto no portfólio ainda"}>
            <p className="m-0 text-body-muted">
              {allWorks.length
                ? "Envie fotos acima ou escolha outra categoria."
                : "Arraste as primeiras fotos para a área acima."}
            </p>
          </StateBox>
        ) : (
          <WorkGrid works={allWorks} visible={visible} categories={categoryList} limits={stats.data?.upload} />
        )}
      </main>
    </>
  );
}

function StateBox({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="border border-line-strong bg-ivory px-[26px] py-[70px] text-center">
      <div className="mb-2 font-serif text-[28px]">{title}</div>
      {children}
    </div>
  );
}

function GridSkeleton() {
  return (
    <div
      className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,250px),1fr))] gap-5"
      aria-busy="true"
      aria-label="Carregando fotos"
    >
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="animate-pulse border border-line-field bg-ivory">
          <div className="aspect-square bg-cream-3" />
          <div className="flex flex-col gap-2.5 p-3.5">
            <div className="h-[38px] bg-cream-2" />
            <div className="h-[38px] bg-cream-2" />
          </div>
        </div>
      ))}
    </div>
  );
}

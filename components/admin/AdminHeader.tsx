"use client";

import { useIsMutating } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useAdminSession } from "@/hooks/useAuth";
import { initials } from "@/lib/format";

/**
 * Cada ação do painel é salva na hora (não há rascunho), então o indicador
 * mostra se há algo sendo gravado agora.
 */
export function AdminHeader() {
  const saving = useIsMutating() > 0;

  return (
    <header className="sticky top-0 z-40 bg-ink text-on-dark">
      <div className="mx-auto flex max-w-[1320px] flex-wrap items-center justify-between gap-x-6 gap-y-3.5 px-[clamp(16px,2.5vw,26px)] py-3.5">
        <div className="flex items-center gap-4">
          <Image
            src="/images/logo.png"
            alt="Tuia Joias"
            width={96}
            height={58}
            className="h-auto w-[clamp(72px,8vw,96px)] contrast-[1.1] invert"
            preload
          />
          <span className="h-[26px] w-px bg-ink-2" aria-hidden />
          <span className="text-[13px] tracking-[0.2em] text-mute-2 uppercase">Painel do portfólio</span>
        </div>

        <div className="flex flex-wrap items-center gap-3.5">
          <span
            className={`flex items-center gap-2 text-[15px] transition-colors ${saving ? "text-gold-light" : "text-mute"}`}
            role="status"
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${saving ? "animate-pulse-dot bg-gold-light" : "bg-mute"}`}
              aria-hidden
            />
            {saving ? "Salvando…" : "Tudo publicado"}
          </span>
          <Link
            href="/"
            target="_blank"
            rel="noopener"
            className="rounded-xs bg-ink-2 px-[22px] py-3 text-[15px] font-semibold text-on-dark-soft transition-[background,color,transform] duration-300 hover:-translate-y-0.5 hover:bg-gold-soft hover:text-ink"
          >
            Ver o site ↗
          </Link>
          <UserMenu />
        </div>
      </div>
    </header>
  );
}

function UserMenu() {
  const { user, logout } = useAdminSession();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Conta de ${user.name}`}
        className="flex h-[38px] w-[38px] cursor-pointer items-center justify-center rounded-full border-0 bg-ink-2 text-[14px] font-semibold text-gold-soft transition-colors hover:bg-ink-3 hover:text-gold-light"
      >
        {initials(user.name)}
      </button>
      {open && (
        <div
          role="menu"
          className="absolute top-[calc(100%+10px)] right-0 z-50 w-[240px] animate-fade-in border border-line-strong bg-ivory text-ink shadow-[0_18px_40px_rgba(36,31,26,.22)]"
        >
          <div className="border-b border-line px-4 py-3.5">
            <div className="truncate text-[15px] font-medium">{user.name}</div>
            <div className="truncate text-[13.5px] text-body-muted">{user.email}</div>
          </div>
          <button
            type="button"
            role="menuitem"
            onClick={logout}
            className="block w-full cursor-pointer border-0 bg-transparent px-4 py-3 text-left text-[15px] text-ink-soft transition-colors hover:bg-cream-2 hover:text-ink"
          >
            Sair
          </button>
        </div>
      )}
    </div>
  );
}

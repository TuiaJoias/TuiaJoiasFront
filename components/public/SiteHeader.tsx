"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { WA_MESSAGES } from "@/lib/content";
import { whatsappLink } from "@/lib/site";

const NAV = [
  { href: "#portfolio", label: "Portfólio" },
  { href: "#servicos", label: "Serviços" },
  { href: "#processo", label: "Processo" },
  { href: "#restauracao", label: "Restauração" },
  { href: "#sobre", label: "Sobre" },
  { href: "#duvidas", label: "Dúvidas" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-[60] border-b border-line backdrop-blur-[12px] transition-[box-shadow,background] duration-300 ${
        scrolled ? "bg-ivory/95 shadow-[0_10px_30px_rgba(36,31,26,.08)]" : "bg-ivory/85"
      }`}
    >
      <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-x-7 gap-y-4 px-[clamp(16px,2.6vw,28px)] py-3.5">
        <a href="#inicio" className="block shrink-0">
          <Image src="/images/logo.png" alt="Tuia Joias" width={132} height={80} className="h-auto w-[clamp(96px,10vw,132px)]" preload />
        </a>
        <nav aria-label="Seções do site" className="hidden flex-wrap items-center gap-x-1.5 gap-y-1 text-[15px] tracking-[0.04em] lg:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-xs px-[13px] py-[9px] text-ink-soft transition-colors hover:bg-cream-2 hover:text-ink"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <a
          href={whatsappLink(WA_MESSAGES.top)}
          target="_blank"
          rel="noopener"
          className="flex shrink-0 items-center gap-2.5 rounded-xs bg-ink px-[clamp(16px,2vw,22px)] py-[13px] text-[15px] font-medium tracking-[0.03em] text-ivory transition-[background,transform] duration-300 hover:-translate-y-0.5 hover:bg-gold hover:text-white"
        >
          <span className="inline-block h-[7px] w-[7px] animate-pulse-dot rounded-full bg-[#7cc894]" aria-hidden />
          Falar no WhatsApp
        </a>
      </div>
    </header>
  );
}

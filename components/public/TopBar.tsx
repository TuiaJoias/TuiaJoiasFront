import { SITE } from "@/lib/site";

export function TopBar() {
  return (
    <div className="bg-ink text-[13px] tracking-[0.12em] text-[#e8dfd0] uppercase">
      <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-x-7 gap-y-2 px-7 py-[9px]">
        <span className="flex items-center gap-2.5">
          <span className="inline-block h-1.5 w-1.5 rotate-45 bg-gold-soft" aria-hidden />
          Oficina própria em {SITE.address.city} · {SITE.address.state}
        </span>
        <span className="flex flex-wrap items-center gap-[22px]">
          <span className="text-mute-3">{SITE.hours}</span>
          <a
            href={SITE.instagram.url}
            target="_blank"
            rel="noopener"
            className="border-b border-gold-soft/50 pb-px text-[#e8dfd0] hover:text-gold-soft"
          >
            {SITE.instagram.handle}
          </a>
        </span>
      </div>
    </div>
  );
}

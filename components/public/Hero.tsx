import Image from "next/image";
import { HERO_STATS, WA_MESSAGES } from "@/lib/content";
import { SITE, whatsappLink } from "@/lib/site";
import { SectionEyebrow } from "./SectionEyebrow";

export function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden bg-ivory">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(1100px_620px_at_78%_8%,#f6eede_0%,rgba(246,238,222,0)_62%)]"
        aria-hidden
      />
      <div className="relative mx-auto grid max-w-[1240px] grid-cols-[repeat(auto-fit,minmax(min(100%,360px),1fr))] items-center gap-[clamp(36px,5vw,72px)] px-7 pt-[clamp(48px,7vw,104px)] pb-[clamp(56px,7vw,96px)]">
        <div className="animate-fade-in">
          <SectionEyebrow className="mb-[26px]">{`Ourivesaria artesanal · desde ${SITE.foundedYear}`}</SectionEyebrow>
          <h1 className="m-0 mb-[26px] font-serif text-[clamp(44px,6.4vw,86px)] leading-[1.02] font-normal tracking-[-0.015em]">
            Cada joia sai
            <br />
            da bancada com
            <br />
            <em className="text-gold italic">nome e história.</em>
          </h1>
          <p className="m-0 mb-9 max-w-[50ch] text-[clamp(18px,1.4vw,21px)] leading-[1.65] text-body">
            Somos uma oficina de ourives em Cascavel. Desenhamos, fundimos, acabamos e cravamos peças de ouro sob
            medida — e devolvemos a vida a joias de família que já foram consideradas perdidas.
          </p>
          <div className="mb-11 flex flex-wrap gap-3.5">
            <a
              href={whatsappLink(WA_MESSAGES.hero)}
              target="_blank"
              rel="noopener"
              className="rounded-xs bg-gold px-8 py-[17px] text-[17px] font-medium tracking-[0.02em] text-white shadow-[0_10px_26px_rgba(156,119,38,.22)] transition-[transform,box-shadow,background] duration-300 hover:-translate-y-[3px] hover:bg-gold-hover hover:text-white hover:shadow-[0_16px_34px_rgba(156,119,38,.3)]"
            >
              Pedir um orçamento
            </a>
            <a
              href="#portfolio"
              className="rounded-xs border border-line-dash px-[30px] py-[17px] text-[17px] tracking-[0.02em] text-ink-soft transition-colors duration-300 hover:border-gold hover:bg-[#f4ede1] hover:text-ink"
            >
              Ver o portfólio ↓
            </a>
          </div>
          <div className="flex flex-wrap gap-x-11 border-t border-line pt-[26px]">
            {HERO_STATS.map((stat) => (
              <div key={stat.label} className="pr-[30px] last:pr-0">
                <div className="font-serif text-[38px] leading-none text-ink">{stat.value}</div>
                <div className="mt-1.5 text-[13.5px] tracking-[0.09em] text-label uppercase">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative min-h-[clamp(380px,46vw,560px)]">
          <div className="absolute inset-[8%_6%_4%_14%] border border-line-input" aria-hidden />
          <div className="relative ml-[6%] aspect-[4/5] overflow-hidden shadow-[0_26px_60px_rgba(36,31,26,.16)]">
            <Image
              src="/images/anel2.jpg"
              alt="Anel de ouro feito à mão na oficina Tuia Joias"
              fill
              preload
              sizes="(max-width: 760px) 94vw, 560px"
              className="object-cover"
            />
          </div>
          <div className="absolute right-[-2%] bottom-[-6%] aspect-square w-[44%] max-w-[220px] animate-float overflow-hidden border-[6px] border-ivory shadow-[0_18px_40px_rgba(36,31,26,.2)]">
            <Image src="/images/correntinha.jpeg" alt="Corrente de ouro" fill sizes="220px" className="object-cover" />
          </div>
          <div className="absolute top-[6%] left-[-1%] border border-line bg-ivory px-4 py-3 text-[13px] tracking-[0.16em] text-label uppercase">
            Peça única
          </div>
        </div>
      </div>
    </section>
  );
}

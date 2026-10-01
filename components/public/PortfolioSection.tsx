import { WA_MESSAGES } from "@/lib/content";
import { SITE, whatsappLink } from "@/lib/site";
import type { Category } from "@/types/category";
import type { PublicWork } from "@/types/work";
import { Gallery } from "./Gallery";
import { Reveal } from "./Reveal";
import { SectionEyebrow, sectionTitleClass } from "./SectionEyebrow";

interface PortfolioSectionProps {
  works: PublicWork[];
  categories: Category[];
  /** false quando a API não respondeu: o resto do site continua no ar. */
  available: boolean;
}

export function PortfolioSection({ works, categories, available }: PortfolioSectionProps) {
  return (
    <section id="portfolio" className="bg-ivory py-[clamp(64px,8vw,116px)]">
      <div className="mx-auto max-w-[1240px] px-7">
        <Reveal className="mb-[38px] max-w-[60ch]">
          <SectionEyebrow>Portfólio da oficina</SectionEyebrow>
          <h2 className={`${sectionTitleClass} mb-3.5`}>O trabalho fala por nós</h2>
          <p className="m-0 text-[clamp(17px,1.2vw,19px)] text-body">
            Todas as peças abaixo saíram desta bancada. Clique para ampliar.
          </p>
        </Reveal>

        {!available ? (
          <EmptyState
            title="O portfólio não pôde ser carregado agora"
            text="Tente novamente em instantes ou veja as peças mais recentes no nosso Instagram."
          />
        ) : works.length === 0 ? (
          <EmptyState
            title="Novas peças em breve"
            text="Estamos fotografando os trabalhos mais recentes da oficina. Enquanto isso, acompanhe pelo Instagram."
          />
        ) : (
          <Gallery works={works} categories={categories} />
        )}

        <Reveal className="mt-11 flex flex-wrap items-center justify-center gap-[18px] border border-line bg-cream p-7 text-center">
          <p className="m-0 text-[17px] text-body">Viu algo parecido com o que você quer? Mande a referência — a gente adapta.</p>
          <a
            href={whatsappLink(WA_MESSAGES.portfolio)}
            target="_blank"
            rel="noopener"
            className="rounded-xs bg-ink px-[26px] py-3.5 text-[16px] text-ivory transition-colors duration-300 hover:bg-gold hover:text-white"
          >
            Enviar referência no WhatsApp
          </a>
        </Reveal>
      </div>
    </section>
  );
}

function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <div className="border-y border-line py-16 text-center">
      <div className="mb-2 font-serif text-[clamp(26px,3vw,34px)]">{title}</div>
      <p className="m-0 mx-auto mb-5 max-w-[52ch] text-body">{text}</p>
      <a href={SITE.instagram.url} target="_blank" rel="noopener" className="border-b border-gold-soft pb-0.5 text-[16px]">
        Ver {SITE.instagram.handle} →
      </a>
    </div>
  );
}

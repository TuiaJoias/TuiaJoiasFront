import { WA_MESSAGES } from "@/lib/content";
import { whatsappLink } from "@/lib/site";
import { BeforeAfter } from "./BeforeAfter";
import { Reveal } from "./Reveal";
import { SectionEyebrow } from "./SectionEyebrow";

export function Restoration() {
  return (
    <section id="restauracao" className="border-t border-line-soft bg-sand py-[clamp(64px,8vw,116px)]">
      <div className="mx-auto grid max-w-[1240px] grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] items-center gap-[clamp(36px,4.5vw,64px)] px-7">
        <Reveal>
          <SectionEyebrow>Antes & depois</SectionEyebrow>
          <h2 className="m-0 mb-5 font-serif text-[clamp(34px,4.4vw,58px)] leading-[1.05] font-normal">
            Joia guardada na gaveta
            <br />
            volta a ser usada
          </h2>
          <p className="m-0 mb-[18px] text-[clamp(17px,1.2vw,19px)] text-body">
            Anel amassado, corrente arrebentada, peça fora de moda ou fora do dedo. Antes de vender o ouro de família,
            vale mostrar para a gente: na maioria dos casos dá para recuperar — ou transformar em outra coisa que você
            use todo dia.
          </p>
          <p className="m-0 mb-[30px] text-[clamp(17px,1.2vw,19px)] text-body">A avaliação é gratuita e feita na sua frente.</p>
          <a
            href={whatsappLink(WA_MESSAGES.restoration)}
            target="_blank"
            rel="noopener"
            className="inline-block rounded-xs bg-gold px-[30px] py-4 text-[17px] text-white shadow-[0_10px_26px_rgba(156,119,38,.2)] transition-[transform,background] duration-300 hover:-translate-y-[3px] hover:bg-gold-hover hover:text-white"
          >
            Mandar foto da minha joia
          </a>
        </Reveal>
        <Reveal delay={120}>
          <BeforeAfter />
        </Reveal>
      </div>
    </section>
  );
}

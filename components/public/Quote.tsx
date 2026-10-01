import { SITE } from "@/lib/site";
import { QuoteForm } from "./QuoteForm";
import { Reveal } from "./Reveal";
import { SectionEyebrow } from "./SectionEyebrow";

const contactRow =
  "flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 bg-ivory px-[22px] py-5 text-ink transition-colors duration-300";
const contactLabel = "text-[13px] tracking-[0.16em] text-label uppercase";

export function Quote() {
  return (
    <section id="orcamento" className="border-y border-line-soft bg-sand py-[clamp(64px,8vw,116px)]">
      <div className="mx-auto grid max-w-[1240px] grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] items-start gap-[clamp(36px,4.5vw,64px)] px-7">
        <Reveal>
          <SectionEyebrow>Orçamento</SectionEyebrow>
          <h2 className="m-0 mb-5 font-serif text-[clamp(34px,4.4vw,58px)] leading-[1.05] font-normal">
            Monte sua mensagem
            <br />e mande pronta
          </h2>
          <p className="m-0 mb-8 text-[clamp(17px,1.2vw,19px)] text-body">
            Preencha os campos e o WhatsApp abre com o texto já escrito. Você só confirma o envio — e pode anexar as fotos
            de referência direto na conversa.
          </p>
          <div className="grid gap-px border border-line bg-line">
            <a href={SITE.phone.href} className={`${contactRow} hover:bg-cream hover:text-ink`}>
              <span className={contactLabel}>Telefone</span>
              <span className="text-[19px]">{SITE.phone.display}</span>
            </a>
            <a
              href={SITE.instagram.url}
              target="_blank"
              rel="noopener"
              className={`${contactRow} hover:bg-cream hover:text-ink`}
            >
              <span className={contactLabel}>Instagram</span>
              <span className="text-[19px]">{SITE.instagram.handle}</span>
            </a>
            <div className={contactRow}>
              <span className={contactLabel}>Endereço</span>
              <span className="text-right text-[19px]">{SITE.address.full}</span>
            </div>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <QuoteForm />
        </Reveal>
      </div>
    </section>
  );
}

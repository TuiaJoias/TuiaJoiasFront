import { SERVICES } from "@/lib/content";
import { pad2 } from "@/lib/format";
import { Reveal } from "./Reveal";
import { SectionEyebrow, sectionTitleClass } from "./SectionEyebrow";

export function Services() {
  return (
    <section id="servicos" className="border-y border-line-soft bg-sand py-[clamp(64px,8vw,116px)]">
      <div className="mx-auto max-w-[1240px] px-7">
        <Reveal className="mb-[clamp(40px,5vw,64px)] max-w-[60ch]">
          <SectionEyebrow>O que fazemos</SectionEyebrow>
          <h2 className={sectionTitleClass}>
            Do desenho ao conserto —<br />
            tudo na mesma bancada
          </h2>
        </Reveal>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] border-t border-line-strong">
          {SERVICES.map((service, index) => (
            <Reveal key={service.title} delay={(index % 3) * 60}>
              <article className="h-full border-b border-line-strong py-[34px] pr-[30px] transition-colors duration-300 hover:bg-[#faf6ee] md:px-[30px]">
                <div className="mb-3.5 font-serif text-[15px] tracking-[0.2em] text-gold-muted">{pad2(index + 1)}</div>
                <h3 className="m-0 mb-2.5 font-serif text-[28px] leading-[1.2] font-medium">{service.title}</h3>
                <p className="m-0 text-[17px] text-body">{service.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

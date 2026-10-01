import { TESTIMONIALS } from "@/lib/content";
import { Reveal } from "./Reveal";

/** Exibido só quando SHOW_TESTIMONIALS (lib/site.ts) estiver ligado com depoimentos reais. */
export function Testimonials() {
  return (
    <section className="bg-ink py-[clamp(64px,8vw,110px)] text-on-dark">
      <div className="mx-auto max-w-[1240px] px-7">
        <Reveal className="mb-[clamp(40px,5vw,60px)] text-center">
          <span className="text-[12.5px] tracking-[0.24em] text-mute-2 uppercase">Quem já levou uma peça</span>
          <h2 className="m-0 mt-4 font-serif text-[clamp(34px,4.4vw,58px)] leading-[1.05] font-normal text-ivory">
            O que dizem na saída da oficina
          </h2>
        </Reveal>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-[clamp(18px,2vw,30px)]">
          {TESTIMONIALS.map((item, index) => (
            <Reveal key={item.author} delay={index * 80}>
              <figure className="m-0 h-full border border-ink-2 bg-ink-3 px-[30px] py-[34px] transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-[#6a5a3c]">
                <div className="font-serif text-[56px] leading-[.6] text-[#6a5a3c]" aria-hidden>
                  “
                </div>
                <blockquote className="m-0 mt-[18px] mb-[22px] text-[18px] leading-[1.6] text-[#e3daca]">{item.quote}</blockquote>
                <figcaption className="border-t border-ink-2 pt-4 text-[14px] tracking-[0.1em] text-mute-2 uppercase">
                  {item.author}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

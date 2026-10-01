"use client";

import { useEffect, useRef } from "react";
import { PROCESS_STEPS, WA_MESSAGES } from "@/lib/content";
import { pad2 } from "@/lib/format";
import { whatsappLink } from "@/lib/site";
import { SectionEyebrow } from "./SectionEyebrow";

const WIDE = "(min-width: 900px)";

/**
 * No desktop a seção fica presa na tela e a rolagem vertical move as etapas na
 * horizontal. Abaixo de 900px vira uma faixa com rolagem horizontal comum.
 */
export function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const viewRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const media = window.matchMedia(WIDE);
    let frame = 0;

    const update = () => {
      frame = 0;
      const section = sectionRef.current;
      const view = viewRef.current;
      const track = trackRef.current;
      if (!section || !view || !track) return;
      if (!media.matches) {
        track.style.transform = "";
        return;
      }
      const total = section.offsetHeight - window.innerHeight;
      const progress = total > 0 ? Math.min(1, Math.max(0, -section.getBoundingClientRect().top / total)) : 0;
      const distance = Math.max(0, track.scrollWidth - view.clientWidth);
      track.style.transform = `translate3d(${-progress * distance}px,0,0)`;
      if (barRef.current) barRef.current.style.width = `${(progress * 100).toFixed(1)}%`;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    media.addEventListener("change", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      media.removeEventListener("change", schedule);
    };
  }, []);

  return (
    <section id="processo" ref={sectionRef} className="relative bg-ivory min-[900px]:h-[460vh]">
      <div className="flex flex-col justify-center overflow-hidden py-16 min-[900px]:sticky min-[900px]:top-0 min-[900px]:h-screen min-[900px]:py-0">
        <div className="mx-auto w-full max-w-[1240px] px-7 pb-[30px]">
          <SectionEyebrow className="mb-4">Como nasce uma joia</SectionEyebrow>
          <h2 className="m-0 font-serif text-[clamp(32px,4.2vw,56px)] leading-[1.05] font-normal">
            Cinco etapas entre a conversa e a caixinha
          </h2>
        </div>
        <div ref={viewRef} className="w-full overflow-x-auto min-[900px]:overflow-hidden">
          <div ref={trackRef} className="flex w-max gap-[clamp(20px,2.4vw,40px)] px-7 py-2.5 will-change-transform">
            {PROCESS_STEPS.map((step, index) => {
              const last = index === PROCESS_STEPS.length - 1;
              return (
                <article
                  key={step.title}
                  className={`flex w-[min(86vw,480px)] shrink-0 flex-col gap-4 border p-[clamp(26px,3vw,40px)] ${
                    last ? "border-ink bg-ink text-on-dark" : "border-line bg-cream"
                  }`}
                >
                  <div className="flex items-baseline justify-between">
                    <span
                      className={`font-serif text-[clamp(58px,6vw,86px)] leading-[.8] ${last ? "text-[#6a5a3c]" : "text-[#dfd0b2]"}`}
                    >
                      {pad2(index + 1)}
                    </span>
                    <span className="h-[9px] w-[9px] rotate-45 bg-gold-soft" aria-hidden />
                  </div>
                  <h3
                    className={`m-0 font-serif text-[clamp(26px,2.6vw,34px)] leading-[1.15] font-medium ${last ? "text-ivory" : ""}`}
                  >
                    {step.title}
                  </h3>
                  <p className={`m-0 text-[clamp(16px,1.15vw,18px)] ${last ? "text-on-dark-soft" : "text-body"}`}>
                    {step.text}
                  </p>
                  {step.duration ? (
                    <div className="mt-auto border-t border-line pt-4 text-[13px] tracking-[0.14em] text-label-soft uppercase">
                      {step.duration}
                    </div>
                  ) : (
                    <a
                      href={whatsappLink(WA_MESSAGES.process)}
                      target="_blank"
                      rel="noopener"
                      className="mt-auto rounded-xs bg-gold-soft px-6 py-3.5 text-center text-[16px] font-semibold text-ink transition-colors hover:bg-[#e0c179] hover:text-ink"
                    >
                      Começar minha peça
                    </a>
                  )}
                </article>
              );
            })}
            <div className="w-10 shrink-0" aria-hidden />
          </div>
        </div>
        <div className="mx-auto hidden w-full max-w-[1240px] px-7 pt-[30px] min-[900px]:block">
          <div className="relative h-0.5 overflow-hidden bg-line-soft">
            <div ref={barRef} className="absolute inset-y-0 left-0 w-0 bg-gold" />
          </div>
          <div className="mt-3 flex justify-between text-[12.5px] tracking-[0.18em] text-label-soft uppercase">
            <span>Role para avançar</span>
            <span>Conversa → Entrega</span>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import { FAQ } from "@/lib/content";
import { Reveal } from "./Reveal";
import { SectionEyebrow } from "./SectionEyebrow";

export function Faq() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="duvidas" className="bg-ivory py-[clamp(64px,8vw,116px)]">
      <div className="mx-auto grid max-w-[1240px] grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] items-start gap-[clamp(30px,4vw,64px)] px-7">
        <Reveal>
          <SectionEyebrow>Dúvidas frequentes</SectionEyebrow>
          <h2 className="m-0 mb-5 font-serif text-[clamp(34px,4.4vw,56px)] leading-[1.05] font-normal">
            Antes de você perguntar
          </h2>
          <p className="m-0 text-[18px] text-body">
            Não achou sua dúvida? Chame no WhatsApp — quem responde é o ourives, não um robô.
          </p>
        </Reveal>
        <Reveal delay={100} className="border-t border-line">
          {FAQ.map((item, index) => {
            const expanded = open === index;
            const panelId = `faq-${index}`;
            return (
              <div key={item.q} className="border-b border-line">
                <h3 className="m-0 text-[19px] leading-[1.4] font-normal">
                  <button
                    type="button"
                    aria-expanded={expanded}
                    aria-controls={panelId}
                    onClick={() => setOpen(expanded ? null : index)}
                    className="flex w-full cursor-pointer items-start justify-between gap-5 border-0 bg-transparent py-[22px] text-left text-ink transition-colors hover:text-gold"
                  >
                    <span>{item.q}</span>
                    <span
                      className={`shrink-0 text-[22px] leading-[1.2] text-gold transition-transform duration-300 ${expanded ? "rotate-45" : ""}`}
                      aria-hidden
                    >
                      +
                    </span>
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  hidden={!expanded}
                  className="animate-fade-in"
                >
                  <p className="m-0 max-w-[62ch] pb-6 text-[17px] text-body">{item.a}</p>
                </div>
              </div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}

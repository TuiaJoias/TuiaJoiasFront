import { SITE } from "@/lib/site";
import { OfficeMap } from "./OfficeMap";
import { Reveal } from "./Reveal";

export function MapSection() {
  return (
    <section className="bg-ivory">
      <div className="mx-auto max-w-[1240px] px-7 py-[clamp(48px,6vw,80px)]">
        <Reveal className="mb-7 flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
          <h2 className="m-0 font-serif text-[clamp(30px,3.6vw,46px)] leading-[1.05] font-normal">
            Venha tomar um café na oficina
          </h2>
          <a href={SITE.address.mapsUrl} target="_blank" rel="noopener" className="border-b border-gold-soft pb-0.5 text-[16px]">
            Traçar rota →
          </a>
        </Reveal>
        <Reveal className="overflow-hidden border border-line shadow-[0_18px_40px_rgba(36,31,26,.08)]">
          <OfficeMap />
        </Reveal>
      </div>
    </section>
  );
}

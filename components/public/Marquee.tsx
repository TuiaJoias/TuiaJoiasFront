import { Fragment } from "react";
import { MARQUEE_ITEMS } from "@/lib/content";

export function Marquee() {
  const sequence = (copy: number) =>
    MARQUEE_ITEMS.map((item) => (
      <Fragment key={`${copy}-${item}`}>
        <span className="px-[26px]">{item}</span>
        <span className="text-gold-soft">◆</span>
      </Fragment>
    ));

  return (
    <div className="overflow-hidden bg-ink py-[15px]" aria-hidden>
      <div className="flex w-max animate-marquee text-[13px] tracking-[0.3em] whitespace-nowrap text-mute uppercase">
        {sequence(1)}
        {sequence(2)}
      </div>
    </div>
  );
}

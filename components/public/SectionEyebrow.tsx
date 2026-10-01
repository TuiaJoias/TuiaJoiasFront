/** Rótulo acima dos títulos: traço dourado + texto em caixa alta. */
export function SectionEyebrow({ children, className = "mb-[18px]" }: { children: string; className?: string }) {
  return (
    <div className={`flex items-center gap-3.5 ${className}`}>
      <span className="h-px w-[46px] bg-gold-soft" aria-hidden />
      <span className="text-[12.5px] tracking-[0.24em] text-label uppercase">{children}</span>
    </div>
  );
}

export const sectionTitleClass =
  "m-0 font-serif text-[clamp(36px,4.6vw,62px)] leading-[1.05] font-normal";

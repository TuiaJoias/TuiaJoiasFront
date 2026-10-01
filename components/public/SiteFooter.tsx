import { SITE } from "@/lib/site";

const NAV = [
  { href: "#portfolio", label: "Portfólio" },
  { href: "#servicos", label: "Serviços" },
  { href: "#processo", label: "Processo" },
  { href: "#sobre", label: "Sobre a oficina" },
  { href: "#orcamento", label: "Orçamento" },
];

const heading = "mb-4 text-[12.5px] tracking-[0.2em] text-on-dark-faint uppercase";
const link = "text-on-dark-soft hover:text-gold-soft";

export function SiteFooter() {
  return (
    <footer className="bg-ink pt-[clamp(48px,6vw,76px)] text-on-dark-soft">
      <div className="mx-auto max-w-[1240px] px-7">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-9 pb-11">
          <div>
            <div className="font-serif text-[34px] leading-[1.1] text-ivory">{SITE.name}</div>
            <p className="m-0 mt-3.5 max-w-[34ch] text-[16px] leading-[1.6] text-on-dark-muted">
              Oficina de ourivesaria em {SITE.address.city}, Paraná. Joias feitas à mão desde {SITE.foundedYear}.
            </p>
          </div>
          <nav aria-label="Rodapé">
            <div className={heading}>Navegue</div>
            <div className="flex flex-col gap-2.5 text-[16px]">
              {NAV.map((item) => (
                <a key={item.href} href={item.href} className={link}>
                  {item.label}
                </a>
              ))}
            </div>
          </nav>
          <div>
            <div className={heading}>Contato</div>
            <div className="flex flex-col gap-2.5 text-[16px]">
              <a href={SITE.phone.href} className={link}>
                {SITE.phone.display}
              </a>
              <a href={SITE.instagram.url} target="_blank" rel="noopener" className={link}>
                {SITE.instagram.handle}
              </a>
              <span className="text-on-dark-muted">
                {SITE.address.street}
                <br />
                {SITE.address.district} — {SITE.address.city}/{SITE.address.state}
              </span>
              <span className="text-on-dark-muted">{SITE.hours}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap justify-between gap-x-6 gap-y-2.5 border-t border-ink-2 py-[22px] text-[14px] text-on-dark-faint">
          <span>
            © {new Date().getFullYear()} {SITE.name}. Todos os direitos reservados.
          </span>
          <span>{SITE.address.city} · Paraná · Brasil</span>
        </div>
      </div>
    </footer>
  );
}

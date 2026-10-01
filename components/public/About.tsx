import Image from "next/image";
import { ABOUT_HIGHLIGHTS } from "@/lib/content";
import { SITE } from "@/lib/site";
import { Reveal } from "./Reveal";
import { SectionEyebrow } from "./SectionEyebrow";

const paragraph = "m-0 mb-[18px] text-[clamp(17px,1.2vw,19px)] text-body";

export function About() {
  return (
    <section id="sobre" className="bg-ivory py-[clamp(64px,8vw,116px)]">
      <div className="mx-auto grid max-w-[1240px] grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] items-center gap-[clamp(36px,5vw,72px)] px-7">
        <Reveal className="relative">
          <div className="relative aspect-[3/4] overflow-hidden shadow-[0_24px_54px_rgba(36,31,26,.14)]">
            <Image
              src="/images/corrente1.jpg"
              alt="Corrente de ouro produzida na oficina"
              fill
              sizes="(max-width: 760px) 94vw, 560px"
              className="object-cover"
            />
          </div>
          <div className="absolute right-[-14px] bottom-[-22px] max-w-[230px] bg-ink px-[26px] py-[22px] text-on-dark">
            <div className="font-serif text-[44px] leading-none text-gold-soft">{SITE.foundedYear}</div>
            <div className="mt-2 text-[14px] leading-[1.45] text-on-dark-soft">
              ano em que a oficina abriu as portas em {SITE.address.city}
            </div>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <SectionEyebrow>A oficina</SectionEyebrow>
          <h2 className="m-0 mb-6 font-serif text-[clamp(34px,4.4vw,58px)] leading-[1.05] font-normal">
            Uma bancada, não uma vitrine
          </h2>
          <p className={paragraph}>
            Fundada em {SITE.foundedYear}, a Oficina Tuia Joias dedica-se à confecção de joias, transformando sonhos em
            realidade com peças exclusivas e de alta qualidade. Nossa missão é satisfazer e realizar os desejos dos
            nossos clientes, superando suas expectativas com elegância, inovação e um toque pessoal.
          </p>
          <p className={paragraph}>
            Cada joia é projetada e confeccionada com os mais altos padrões de qualidade, utilizando materiais preciosos
            e técnicas artesanais. Acreditamos que uma joia conta histórias e celebra momentos especiais, tornando-se um
            legado precioso.
          </p>
          <p className={`${paragraph} mb-8`}>
            Nossa equipe está sempre pronta para criar joias personalizadas que atendam aos desejos individuais de cada
            cliente. Venha conhecer a oficina e veja a peça nascendo.
          </p>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,150px),1fr))] gap-px border border-line bg-line">
            {ABOUT_HIGHLIGHTS.map((item) => (
              <div key={item} className="bg-ivory p-5">
                <div className="mb-2 font-serif text-[15px] tracking-[0.2em] text-gold-muted" aria-hidden>
                  ✦
                </div>
                <div className="text-[16px] leading-[1.4] text-ink-soft">{item}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

import Image from "next/image";
import type { PublicWork } from "@/types/work";

/** Fotos em pé usam 4/5; quadradas e deitadas usam 1/1, como no design. */
export function tileAspect(work: Pick<PublicWork, "width" | "height">): string {
  return work.height > work.width * 1.1 ? "aspect-[4/5]" : "aspect-square";
}

export function workCaption(work: PublicWork): string {
  return work.description ?? work.category.name;
}

interface GalleryCardProps {
  work: PublicWork;
  onOpen: () => void;
  eager?: boolean;
}

export function GalleryCard({ work, onOpen, eager = false }: GalleryCardProps) {
  return (
    <figure className="group relative m-0 overflow-hidden bg-cream-2">
      <button
        type="button"
        onClick={onOpen}
        aria-label={`Ampliar ${work.title}`}
        className="block w-full cursor-zoom-in border-0 bg-transparent p-0 text-left outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
      >
        <div className={`relative w-full ${tileAspect(work)}`}>
          <Image
            src={work.imageUrl}
            alt={work.title}
            fill
            sizes="(max-width: 640px) 94vw, (max-width: 1100px) 46vw, 400px"
            loading={eager ? "eager" : "lazy"}
            className="object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-[1.07]"
          />
        </div>
        <figcaption className="absolute inset-x-0 bottom-0 bg-linear-to-t from-[rgba(28,24,20,.86)] to-transparent px-[18px] pt-11 pb-4 text-ivory opacity-0 transition-opacity duration-400 group-hover:opacity-100 group-focus-within:opacity-100">
          <div className="font-serif text-[23px] leading-[1.2]">{work.title}</div>
          <div className="mt-1 text-[13px] tracking-[0.11em] text-[#d9c9a5] uppercase">{workCaption(work)}</div>
        </figcaption>
      </button>
    </figure>
  );
}

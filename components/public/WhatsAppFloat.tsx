import { WA_MESSAGES } from "@/lib/content";
import { whatsappLink } from "@/lib/site";

export function WhatsAppFloat() {
  return (
    <a
      href={whatsappLink(WA_MESSAGES.float)}
      target="_blank"
      rel="noopener"
      aria-label="Conversar no WhatsApp"
      className="fixed right-5 bottom-5 z-[80] flex items-center gap-2.5 rounded-full bg-whatsapp px-[22px] py-[15px] text-[16px] font-semibold text-white shadow-[0_12px_30px_rgba(30,143,83,.34)] transition-[transform,background] duration-300 hover:-translate-y-[3px] hover:bg-whatsapp-hover hover:text-white"
    >
      <span className="inline-block h-[9px] w-[9px] animate-pulse-dot rounded-full bg-[#b6f0cc]" aria-hidden />
      WhatsApp
    </a>
  );
}

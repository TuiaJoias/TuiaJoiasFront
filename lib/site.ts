/** Endereço usado na busca do Google Maps (link "Traçar rota" e mapa embutido). */
const MAPS_QUERY = encodeURIComponent("R. Rio Grande do Sul, 222 - Centro, Cascavel - PR");

/** Dados fixos da oficina usados no site público. */
export const SITE = {
  name: "Tuia Joias",
  foundedYear: 2010,
  whatsapp: "5545998074033",
  phone: {
    display: "(45) 99807-4033",
    href: "tel:+5545998074033",
  },
  instagram: {
    handle: "@tuia_joias",
    url: "https://www.instagram.com/tuia_joias",
  },
  address: {
    street: "R. Rio Grande do Sul, 222",
    district: "Centro",
    city: "Cascavel",
    state: "PR",
    full: "R. Rio Grande do Sul, 222 — Centro, Cascavel/PR",
    mapsUrl: `https://maps.google.com/?q=${MAPS_QUERY}`,
    /** Embed por endereço: não precisa de chave de API e acompanha o endereço acima. */
    mapsEmbedUrl: `https://www.google.com/maps?q=${MAPS_QUERY}&z=17&hl=pt-BR&output=embed`,
  },
  hours: "Seg a Sex · 9h às 18h",
} as const;

/**
 * Os depoimentos do design são exemplos. Mantenha desligado até
 * substituí-los pelos depoimentos reais dos clientes.
 */
export const SHOW_TESTIMONIALS = false;

/** Link do WhatsApp com a mensagem já preenchida. */
export function whatsappLink(message: string): string {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`;
}

/** Endereço usado na busca do Google Maps (link "Traçar rota"). */
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
    /**
     * Posição do pino no mapa da home. Ponto que o Google retorna para o
     * endereço acima. Se o endereço mudar, atualize as duas coisas juntas.
     */
    coordinates: { lat: -24.956935, lng: -53.452093 },
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

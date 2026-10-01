"use client";

import "leaflet/dist/leaflet.css";
import type { Map as LeafletMap } from "leaflet";
import { useEffect, useRef, useState } from "react";
import { SITE } from "@/lib/site";

// Tiles do OpenStreetMap: sem chave de API, liberados para sites de baixo
// tráfego com o crédito abaixo. A paleta do site vem do filtro aplicado em
// .tuia-map .leaflet-tile-pane (app/globals.css), não dos tiles em si.
const TILE_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>';
const ZOOM = 16;

// Conteúdo montado só com constantes de lib/site.ts (nada vindo de usuário).
const POPUP_HTML = `
  <p class="tuia-map-popup-eyebrow">A oficina</p>
  <p class="tuia-map-popup-title">${SITE.name}</p>
  <p class="tuia-map-popup-text">${SITE.address.street}<br>${SITE.address.district} — ${SITE.address.city}/${SITE.address.state}</p>
  <p class="tuia-map-popup-text tuia-map-popup-muted">${SITE.hours}</p>
  <a class="tuia-map-popup-link" href="${SITE.address.mapsUrl}" target="_blank" rel="noopener">Traçar rota →</a>
`;

export function OfficeMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let map: LeafletMap | undefined;
    let cancelled = false;

    async function init(el: HTMLDivElement) {
      // Sem translate3d, cada tile deixa de ser uma camada própria na GPU. Com o
      // mapa numa posição fracionada da página (comum com fontes em clamp()),
      // essas camadas deixavam uma emenda clara entre as fileiras de tiles.
      // Custo: o zoom troca de nível sem animação.
      (window as Window & { L_DISABLE_3D?: boolean }).L_DISABLE_3D = true;
      const L = await import("leaflet");
      if (cancelled) return;

      const { lat, lng } = SITE.address.coordinates;
      map = L.map(el, {
        center: [lat, lng],
        zoom: ZOOM,
        minZoom: 12,
        maxZoom: 19,
        zoomControl: false,
        attributionControl: false,
        // A roda do mouse só dá zoom depois de clicar no mapa, para não
        // prender a rolagem da página.
        scrollWheelZoom: false,
        // No celular, arrastar com um dedo rola a página; o zoom fica nos botões e na pinça.
        dragging: !L.Browser.mobile,
      });

      L.tileLayer(TILE_URL, { maxZoom: 19, attribution: TILE_ATTRIBUTION }).addTo(map);
      L.control.zoom({ position: "bottomright", zoomInTitle: "Aproximar", zoomOutTitle: "Afastar" }).addTo(map);
      L.control.attribution({ position: "bottomleft", prefix: false }).addTo(map);

      const icon = L.divIcon({
        className: "tuia-map-pin",
        html: '<span class="tuia-map-pin-halo"></span><span class="tuia-map-pin-gem"></span>',
        iconSize: [44, 44],
        iconAnchor: [22, 22],
        popupAnchor: [0, -14],
        tooltipAnchor: [12, 0],
      });

      L.marker([lat, lng], { icon, title: `${SITE.name} · ${SITE.address.full}`, riseOnHover: true })
        .addTo(map)
        .bindTooltip(SITE.name, { permanent: true, direction: "right", className: "tuia-map-label" })
        .bindPopup(POPUP_HTML, { className: "tuia-map-popup", maxWidth: 260, autoPanPadding: [24, 24] });

      const activeMap = map;
      activeMap.on("click focus", () => activeMap.scrollWheelZoom.enable());
      activeMap.on("mouseout blur", () => activeMap.scrollWheelZoom.disable());

      setReady(true);
    }

    // Leaflet e tiles só carregam quando a seção está perto de aparecer.
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        void init(container);
      },
      { rootMargin: "300px 0px" },
    );
    observer.observe(container);

    return () => {
      cancelled = true;
      observer.disconnect();
      map?.remove();
    };
  }, []);

  return (
    <div className="tuia-map relative isolate h-[clamp(320px,36vw,420px)] bg-cream-2">
      <div
        ref={containerRef}
        role="region"
        aria-label={`Mapa da oficina ${SITE.name}: ${SITE.address.full}`}
        className="absolute inset-0"
      />
      {/* Moldura suave sobre os tiles, abaixo do pino e dos controles. */}
      <div aria-hidden className="tuia-map-vignette pointer-events-none absolute inset-0" />
      <div
        aria-hidden={ready}
        className={`absolute inset-0 z-1000 flex flex-col items-center justify-center gap-3 bg-cream-2 text-center transition-opacity duration-500 ${
          ready ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      >
        <span className="size-2.5 rotate-45 bg-gold-soft" />
        <span className="font-serif text-[22px] leading-tight">{SITE.name}</span>
        <span className="text-[15px] text-body-muted">{SITE.address.full}</span>
      </div>
    </div>
  );
}

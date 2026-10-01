"use client";

import Image from "next/image";
import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";

/** Comparador antes/depois: arraste a alça (ou use as setas do teclado). */
export function BeforeAfter() {
  const [percent, setPercent] = useState(52);
  const dragging = useRef(false);

  function moveTo(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    setPercent(Math.min(100, Math.max(0, ((event.clientX - rect.left) / rect.width) * 100)));
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const step = event.shiftKey ? 10 : 4;
    if (event.key === "ArrowLeft") setPercent((p) => Math.max(0, p - step));
    else if (event.key === "ArrowRight") setPercent((p) => Math.min(100, p + step));
    else return;
    event.preventDefault();
  }

  return (
    <div>
      <div
        role="slider"
        tabIndex={0}
        aria-label="Comparar antes e depois da restauração"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(percent)}
        onKeyDown={onKeyDown}
        onPointerDown={(event) => {
          dragging.current = true;
          event.currentTarget.setPointerCapture(event.pointerId);
          moveTo(event);
        }}
        onPointerMove={(event) => dragging.current && moveTo(event)}
        onPointerUp={() => (dragging.current = false)}
        onPointerCancel={() => (dragging.current = false)}
        className="relative aspect-[4/3] cursor-ew-resize touch-none overflow-hidden bg-ink shadow-[0_22px_50px_rgba(36,31,26,.16)] outline-none select-none focus-visible:ring-2 focus-visible:ring-gold"
      >
        <Image
          src="/images/anel-macico.jpeg"
          alt="Joia antes da restauração"
          fill
          sizes="(max-width: 760px) 94vw, 600px"
          draggable={false}
          className="pointer-events-none object-cover brightness-[.82] contrast-[.92] grayscale-[.72]"
        />
        <div className="pointer-events-none absolute inset-0" style={{ clipPath: `inset(0 ${100 - percent}% 0 0)` }}>
          <Image
            src="/images/anel2.jpg"
            alt="Joia depois da restauração"
            fill
            sizes="(max-width: 760px) 94vw, 600px"
            draggable={false}
            className="object-cover"
          />
        </div>
        <div
          className="pointer-events-none absolute inset-y-0 w-0.5 bg-ivory shadow-[0_0_14px_rgba(0,0,0,.4)]"
          style={{ left: `${percent}%` }}
        />
        <div
          className="pointer-events-none absolute top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-[5px] rounded-full bg-ivory text-[15px] text-ink shadow-[0_6px_18px_rgba(0,0,0,.3)]"
          style={{ left: `${percent}%` }}
          aria-hidden
        >
          ◀ ▶
        </div>
        <div className="pointer-events-none absolute top-3.5 left-3.5 bg-ivory/90 px-3 py-1.5 text-[12px] tracking-[0.18em] text-ink uppercase">
          Depois
        </div>
        <div className="pointer-events-none absolute top-3.5 right-3.5 bg-ink/70 px-3 py-1.5 text-[12px] tracking-[0.18em] text-on-dark uppercase">
          Antes
        </div>
      </div>
      <p className="m-0 mt-3 text-center text-[14px] text-label">
        Arraste a alça para comparar · exemplo com fotos do acervo
      </p>
    </div>
  );
}

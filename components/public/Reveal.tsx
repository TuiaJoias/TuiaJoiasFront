"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Atraso em ms depois que o bloco entra na tela. */
  delay?: number;
}

/**
 * Entrada suave ao rolar. O HTML do servidor já vem visível (funciona sem JS);
 * só os blocos que estão abaixo da dobra são escondidos e revelados depois.
 */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || !("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (element.getBoundingClientRect().top < window.innerHeight * 0.94) return;

    element.style.opacity = "0";
    element.style.transform = "translateY(22px)";
    element.style.transition =
      "opacity .95s cubic-bezier(.2,.7,.2,1), transform .95s cubic-bezier(.2,.7,.2,1)";

    let timer: number | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        timer = window.setTimeout(() => {
          element.style.opacity = "";
          element.style.transform = "";
        }, delay);
        observer.disconnect();
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.06 },
    );
    observer.observe(element);
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, [delay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

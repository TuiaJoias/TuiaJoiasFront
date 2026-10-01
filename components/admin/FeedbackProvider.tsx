"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";

type Tone = "error" | "success";

interface FeedbackMessage {
  id: number;
  tone: Tone;
  text: string;
}

interface FeedbackApi {
  notify: (text: string, tone?: Tone) => void;
}

const FeedbackContext = createContext<FeedbackApi | null>(null);

const DISMISS_AFTER_MS = 5_000;

/** Avisos curtos no rodapé da tela (erros de salvamento, confirmações). */
export function FeedbackProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<FeedbackMessage[]>([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id: number) => {
    setMessages((current) => current.filter((m) => m.id !== id));
  }, []);

  const notify = useCallback(
    (text: string, tone: Tone = "error") => {
      const id = ++nextId.current;
      setMessages((current) => [...current.slice(-2), { id, tone, text }]);
      window.setTimeout(() => dismiss(id), DISMISS_AFTER_MS);
    },
    [dismiss],
  );

  const api = useMemo(() => ({ notify }), [notify]);

  return (
    <FeedbackContext.Provider value={api}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-5 z-[200] flex flex-col items-center gap-2 px-4"
        aria-live="polite"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            role={message.tone === "error" ? "alert" : "status"}
            className={`pointer-events-auto flex max-w-[560px] animate-fade-in items-start gap-4 border px-5 py-3.5 text-[15px] shadow-[0_14px_30px_rgba(36,31,26,.18)] ${
              message.tone === "error"
                ? "border-danger/30 bg-ivory text-danger"
                : "border-ink bg-ink text-on-dark"
            }`}
          >
            <span className="flex-1">{message.text}</span>
            <button
              type="button"
              onClick={() => dismiss(message.id)}
              className="cursor-pointer border-0 bg-transparent p-0 text-[13px] tracking-[0.12em] uppercase opacity-70 hover:opacity-100"
              aria-label="Fechar aviso"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </FeedbackContext.Provider>
  );
}

export function useFeedback(): FeedbackApi {
  const api = useContext(FeedbackContext);
  if (!api) throw new Error("useFeedback precisa estar dentro de <FeedbackProvider>.");
  return api;
}

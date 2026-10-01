"use client";

import { useState } from "react";
import { QUOTE_TYPES } from "@/lib/content";
import { whatsappLink } from "@/lib/site";

const fieldClass =
  "w-full rounded-xs border border-line-input bg-white px-4 py-[15px] text-[17px] outline-none transition " +
  "focus:border-gold focus:shadow-[0_0_0_3px_rgba(156,119,38,.12)]";
const labelClass = "mb-[9px] block text-[13px] tracking-[0.16em] text-label uppercase";

/** Monta a mensagem e abre o WhatsApp. Nada é enviado ao servidor. */
export function QuoteForm() {
  const [name, setName] = useState("");
  const [type, setType] = useState(QUOTE_TYPES[0]);
  const [details, setDetails] = useState("");

  const trimmedName = name.trim();
  const trimmedDetails = details.trim();
  const message =
    "Olá, Tuia Joias! " +
    (trimmedName ? `Meu nome é ${trimmedName}. ` : "") +
    `Tenho interesse em: ${type}.` +
    (trimmedDetails ? ` ${trimmedDetails}` : "") +
    " Poderiam me passar um orçamento?";

  return (
    <div className="border border-line bg-ivory p-[clamp(26px,3vw,42px)] shadow-[0_20px_44px_rgba(36,31,26,.07)]">
      <label htmlFor="quote-name" className={labelClass}>
        Seu nome
      </label>
      <input
        id="quote-name"
        type="text"
        autoComplete="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Como podemos te chamar?"
        className={`${fieldClass} mb-6`}
      />

      <label htmlFor="quote-type" className={labelClass}>
        O que você precisa
      </label>
      <select
        id="quote-type"
        value={type}
        onChange={(e) => setType(e.target.value)}
        className={`${fieldClass} mb-6 cursor-pointer`}
      >
        {QUOTE_TYPES.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>

      <label htmlFor="quote-details" className={labelClass}>
        Detalhes <span className="tracking-normal text-[#9a8c76] normal-case">(opcional)</span>
      </label>
      <textarea
        id="quote-details"
        rows={4}
        value={details}
        onChange={(e) => setDetails(e.target.value)}
        placeholder="Ex.: quero um anel parecido com o da foto, em ouro 18k, aro 18, para presentear no mês que vem."
        className={`${fieldClass} mb-[26px] resize-y leading-normal`}
      />

      <a
        href={whatsappLink(message)}
        target="_blank"
        rel="noopener"
        className="block rounded-xs bg-gold px-6 py-[18px] text-center text-[18px] font-medium tracking-[0.02em] text-white shadow-[0_12px_28px_rgba(156,119,38,.24)] transition-[transform,background] duration-300 hover:-translate-y-[3px] hover:bg-gold-hover hover:text-white"
      >
        Abrir conversa no WhatsApp
      </a>
      <p className="m-0 mt-4 text-center text-[14px] text-label">
        Resposta no mesmo dia útil. Nenhum dado fica salvo neste site.
      </p>
    </div>
  );
}

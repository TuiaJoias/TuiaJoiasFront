/** 8 → "08" (contadores e posições do painel). */
export function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

/** plural(1, "foto", "fotos") → "foto". */
export function plural(count: number, singular: string, pluralForm: string): string {
  return count === 1 ? singular : pluralForm;
}

/** 524288 → "512 KB"; 3_500_000 → "3,3 MB". */
export function fileSize(bytes: number): string {
  const kb = bytes / 1024;
  if (kb < 1024) return `${Math.max(1, Math.round(kb))} KB`;
  return `${(kb / 1024).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} MB`;
}

/** "anel-solitario_ouro.jpg" → "Anel solitario ouro" (sugestão de título no upload). */
export function titleFromFilename(filename: string): string {
  const base = filename
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const title = base ? base.charAt(0).toUpperCase() + base.slice(1) : "";
  return title.slice(0, 120);
}

/** "Luiz Antonio Taborda" → "LT". */
export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "TJ";
  const first = parts[0][0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1][0] ?? "") : "";
  return (first + last).toUpperCase();
}

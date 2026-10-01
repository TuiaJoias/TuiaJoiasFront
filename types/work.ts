import type { Category } from "./category";

/** Trabalho publicado, como aparece no site (GET /works e GET /works/:id). */
export interface PublicWork {
  id: number;
  title: string;
  /** Linha curta opcional, ex.: "Ouro 18k · peça única". */
  description: string | null;
  /** WebP otimizado no Supabase Storage. */
  imageUrl: string;
  /** Dimensões reais da imagem otimizada (para aspect-ratio e next/image). */
  width: number;
  height: number;
  isFavorite: boolean;
  position: number;
  category: Category;
  createdAt: string;
}

/** Trabalho no painel (GET /admin/works): inclui status de publicação. */
export interface Work extends PublicWork {
  categoryId: number;
  isPublished: boolean;
  updatedAt: string;
}

/** Query de GET /works (somente trabalhos publicados, por position ASC). */
export interface PublicWorksQuery {
  /** Slug da categoria, ex.: "aneis". */
  category?: string;
  page?: number;
  /** Até 100. Padrão do backend: 50. */
  limit?: number;
}

/** GET /admin/works/stats — números do painel calculados pelo backend. */
export interface WorkStats {
  total: number;
  favorites: number;
  hidden: number;
  published: number;
  maxWorks: number;
  /** Quantos trabalhos ainda cabem antes de atingir MAX_WORKS. */
  remaining: number;
  upload: {
    maxFileSizeMb: number;
    acceptedMimeTypes: string[];
  };
}

/** Resposta de POST /admin/works/uploads (1ª etapa do upload direto). */
export interface UploadTicket {
  /** Caminho temporário, enviado depois em POST/PATCH /admin/works. */
  uploadPath: string;
  /** URL assinada do Supabase para o navegador fazer PUT do arquivo. */
  uploadUrl: string;
  expiresInSeconds: number;
}

export type UploadPurpose = "create" | "replace";

/** Dados do formulário de criação; o serviço cuida das 3 etapas do upload. */
export interface CreateWorkInput {
  file: File;
  title: string;
  categoryId: number;
  description?: string;
  isFavorite?: boolean;
}

/** PATCH /admin/works/:id. Com `file`, a foto é trocada pelo upload direto. */
export interface UpdateWorkInput {
  title?: string;
  categoryId?: number;
  /** String vazia ou null remove a descrição. */
  description?: string | null;
  file?: File;
}

export interface ReorderItem {
  id: number;
  position: number;
}

/** PATCH /admin/works/reorder — lista COMPLETA com posições 1..N. */
export interface ReorderWorksInput {
  items: ReorderItem[];
}

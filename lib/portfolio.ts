import { listCategories } from "@/services/categories";
import { listPublicWorks } from "@/services/works";
import type { Category } from "@/types/category";
import type { PublicWork } from "@/types/work";

/**
 * Em produção a página é regenerada no máximo a cada 60 s (ISR): o site fica
 * rápido e continua servindo a última versão se a API demorar a responder.
 * Em desenvolvimento busca sempre, para ver as mudanças do painel na hora.
 */
export const PORTFOLIO_REVALIDATE_SECONDS = process.env.NODE_ENV === "production" ? 60 : 0;

/** O backend devolve no máximo 100 por página, acima do MAX_WORKS (15). */
const PAGE_SIZE = 100;

export interface PortfolioData {
  works: PublicWork[];
  categories: Category[];
  /** false se a API não respondeu: a galeria mostra um aviso e o resto do site segue no ar. */
  available: boolean;
}

export async function getPortfolio(): Promise<PortfolioData> {
  const init = { next: { revalidate: PORTFOLIO_REVALIDATE_SECONDS, tags: ["portfolio"] } };
  try {
    const [works, categories] = await Promise.all([
      listPublicWorks({ limit: PAGE_SIZE }, init),
      listCategories(init),
    ]);
    return { works: works.items, categories, available: true };
  } catch (error) {
    console.error("[portfolio] Não foi possível carregar os trabalhos da API:", error);
    return { works: [], categories: [], available: false };
  }
}

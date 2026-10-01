/** Categoria como a API retorna (GET /categories, GET /admin/categories e dentro de cada Work). */
export interface Category {
  id: number;
  name: string;
  slug: string;
}

/** POST /admin/categories — o backend gera o slug a partir do nome se ele não vier. */
export interface CreateCategoryInput {
  name: string;
  slug?: string;
}

export type UpdateCategoryInput = Partial<CreateCategoryInput>;

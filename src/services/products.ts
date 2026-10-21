import { api } from "./api";
import type { ProductProps } from "../types";

// Resposta da listagem de produtos da API
export interface ProductsResponse {
  products: ProductProps[];
  total: number;
  skip: number;
  limit: number;
}

// Categoria de produto retornada pela API
export interface ProductCategory {
  slug: string;
  name: string;
  url: string;
}

// Direção da ordenação aceita pela API
export type SortOrder = "asc" | "desc";

// Parâmetros aceitos pela listagem de produtos
export interface ProductParams {
  q?: string;
  category?: string;
  sortBy?: string;
  order?: SortOrder;
  limit?: number;
  skip?: number;
}

// Busca uma página de produtos.
// A rota varia conforme os filtros: busca por texto, por categoria ou a listagem completa.
// O signal permite cancelar a requisição quando os filtros mudam.
export async function getProducts(
  params: ProductParams,
  signal?: AbortSignal
): Promise<ProductsResponse> {
  const { q, category, ...rest } = params;
  const endpoint = q
    ? "/products/search"
    : category
      ? `/products/category/${category}`
      : "/products";

  const { data } = await api.get<ProductsResponse>(endpoint, {
    params: q ? { q, ...rest } : rest,
    signal,
  });
  return data;
}

// Busca a lista de categorias de produtos
export async function getCategories(signal?: AbortSignal): Promise<ProductCategory[]> {
  const { data } = await api.get<ProductCategory[]>("/products/categories", { signal });
  return data;
}

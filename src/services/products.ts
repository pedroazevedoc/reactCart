import { api } from "./api";
import type { ProductProps } from "../types";

// Resposta da listagem de produtos da API
export interface ProductsResponse {
  products: ProductProps[];
  total: number;
  skip: number;
  limit: number;
}

// Direção da ordenação aceita pela API
export type SortOrder = "asc" | "desc";

// Opções de ordenação disponíveis na home
export interface SortOption {
  value: string;
  sortBy: string;
  order: SortOrder;
}

// Parâmetros aceitos pela listagem de produtos
export interface ProductParams {
  q?: string;
  sortBy?: string;
  order?: SortOrder;
  limit?: number;
  skip?: number;
}

// Busca uma página de produtos.
// Com "q" usa a rota de busca da API; sem "q", a listagem completa.
// O signal permite cancelar a requisição quando o usuário digita novamente.
export async function getProducts(
  params: ProductParams,
  signal?: AbortSignal
): Promise<ProductsResponse> {
  const { q, ...rest } = params;
  const endpoint = q ? "/products/search" : "/products";

  const { data } = await api.get<ProductsResponse>(endpoint, {
    params: q ? { q, ...rest } : rest,
    signal,
  });
  return data;
}

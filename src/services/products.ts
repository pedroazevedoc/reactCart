import { api } from "./api";
import type { ProductProps } from "../types";

// Resposta da listagem de produtos da API
export interface ProductsResponse {
  products: ProductProps[];
  total: number;
  skip: number;
  limit: number;
}

// Parâmetros aceitos pela listagem de produtos
export interface ProductParams {
  limit?: number;
  skip?: number;
}

// Busca uma página de produtos (com paginação via limit/skip)
export async function getProducts(params: ProductParams): Promise<ProductsResponse> {
  const { data } = await api.get<ProductsResponse>("/products", { params });
  return data;
}

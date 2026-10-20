import { createContext, useState } from "react";
import type { FavoriteContextData, FavoriteProductProps, FavoriteProviderProps, ProductProps } from "../types";

export const FavoriteContext = createContext({} as FavoriteContextData);

function FavoriteProvider({ children }: FavoriteProviderProps) {
  const [ favorites, setFavorites ] = useState<FavoriteProductProps[]>([]);

  // Função para adicionar um produto aos favoritos
  const addToFavorites = (newItem: ProductProps) => {
    // Verifica se o produto já está nos favoritos
    const existingProductIndex = favorites.findIndex(item => item.product.id === newItem.id);

    // Se o produto já estiver nos favoritos, não faz nada
    if (existingProductIndex !== -1) {
      return;
    }

    // Se o produto não estiver nos favoritos, adiciona um novo item
    const newProduct: FavoriteProductProps = {
      product: newItem,
      addedAt: new Date().toISOString(),
    };
    setFavorites([...favorites, newProduct]);
  };

  // Função para remover um produto dos favoritos
  const removeFromFavorites = (productId: number) => {
    setFavorites(favorites.filter(item => item.product.id !== productId));
  };

  return (
    <FavoriteContext.Provider
      value={{ 
        favorites,
        addToFavorites,
        removeFromFavorites
      }}
    >
      {children}
    </FavoriteContext.Provider>
  );
}

export default FavoriteProvider;
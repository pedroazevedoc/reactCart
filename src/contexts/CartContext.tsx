import { createContext, useState } from "react";
import type { CartContextData, CartProductProps, CartProviderProps, ProductProps } from "../types";

export const CartContext = createContext({} as CartContextData);

function CartProvider({ children }: CartProviderProps) {
  const [ cart, setCart ] = useState<CartProductProps[]>([]);

  // Função para adicionar um produto ao carrinho
  const addToCart = (newItem: ProductProps) => {
    // Verifica se o produto já está no carrinho
    const existingProductIndex = cart.findIndex(item => item.product.id === newItem.id);

    // Se o produto já estiver no carrinho, atualiza a quantidade e o preço total
    if (existingProductIndex !== -1) {
      const updatedCart = [...cart];
      updatedCart[existingProductIndex].quantity += 1;
      updatedCart[existingProductIndex].totalPrice = updatedCart[existingProductIndex].quantity * updatedCart[existingProductIndex].price;
      setCart(updatedCart);
      return;
    }

    // Se o produto não estiver no carrinho, adiciona um novo item
    const newProduct: CartProductProps = {
      product: newItem,
      quantity: 1,
      price: newItem.price,
      totalPrice: newItem.price,
      addedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setCart([...cart, newProduct]);
  };

  return (
    <CartContext.Provider 
      value={{
        cart,
        cartAmount: cart.length,
        addToCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export default CartProvider;
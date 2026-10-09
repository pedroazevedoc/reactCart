import { createContext, useState } from "react";
import type { CartContextData, CartProductProps, CartProviderProps } from "../types";

export const CartContext = createContext({} as CartContextData);

function CartProvider({ children }: CartProviderProps) {
  const [ cart, setCart ] = useState<CartProductProps[]>([]);

  return (
    <CartContext.Provider 
      value={{
        cart,
        cartAmount: cart.length
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export default CartProvider;
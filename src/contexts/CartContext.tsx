import { createContext, useState } from "react";
import type { CartContextData, CartProductProps, CartProviderProps, ProductProps } from "../types";

export const CartContext = createContext({} as CartContextData);

function CartProvider({ children }: CartProviderProps) {
  const [ cart, setCart ] = useState<CartProductProps[]>([]);
  const [ cartTotal, setCartTotal ] = useState<string>('0,00');

  // Função para adicionar um produto ao carrinho
  const addToCart = (newItem: ProductProps) => {
    // Verifica se o produto já está no carrinho
    const existingProductIndex = cart.findIndex(item => item.product.id === newItem.id);

    // Se o produto já estiver no carrinho, atualiza a quantidade e o preço total
    if (existingProductIndex !== -1) {
      const updatedCart = [...cart];
      updatedCart[existingProductIndex].amount += 1;
      updatedCart[existingProductIndex].totalPrice = updatedCart[existingProductIndex].amount * updatedCart[existingProductIndex].price;
      setCart(updatedCart);
      calculateCartTotal(updatedCart);
      return;
    }

    // Se o produto não estiver no carrinho, adiciona um novo item
    const newProduct: CartProductProps = {
      product: newItem,
      amount: 1,
      price: newItem.price,
      totalPrice: newItem.price,
      addedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setCart([...cart, newProduct]);
    calculateCartTotal([...cart, newProduct]);
  };

  // Função para remover um produto do carrinho
  const removeFromCart = (productId: number) => {
    // Verifica se o produto está no carrinho
    const indexItem = cart.findIndex(item => item.product.id === productId);

    // Se a quantidade do produto for maior que 1, apenas diminui a quantidade e atualiza o preço total
    if (cart[indexItem].amount > 1) {
      const updatedCart = [...cart];
      updatedCart[indexItem].amount -= 1;
      updatedCart[indexItem].totalPrice = updatedCart[indexItem].amount * updatedCart[indexItem].price;
      setCart(updatedCart);
      calculateCartTotal(updatedCart);
      return;
    }

    // Se a quantidade do produto for 1, remove o produto do carrinho
    const updatedCart = cart.filter(item => item.product.id !== productId);
    setCart(updatedCart);
    calculateCartTotal(updatedCart);
  };

  // Função para calcular o valor total do carrinho
  const calculateCartTotal = (cart: CartProductProps[]) => {
    const result = cart.reduce((total, item) => total + item.totalPrice, 0);
    setCartTotal(result.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));
  }

  return (
    <CartContext.Provider 
      value={{
        cart,
        cartAmount: cart.length,
        cartTotal,
        addToCart,
        removeFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export default CartProvider;
import CartProvider from "./CartContext";
import FavoriteProvider from "./FavoriteContext";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <FavoriteProvider>
        {children}
      </FavoriteProvider>
    </CartProvider>
  );
}
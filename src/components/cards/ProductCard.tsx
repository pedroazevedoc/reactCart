import { useContext } from "react";
import { CartContext } from "../../contexts/CartContext";
import toast from "react-hot-toast";
import type { ProductCardProps, ProductProps } from "../../types";
import { BsCartPlus } from "react-icons/bs";

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useContext(CartContext);
  
  // Função para adicionar um produto ao carrinho
  const handleAddToCart = (product: ProductProps) => {
    addToCart(product);
    toast.success(`${product.title} adicionado ao carrinho!`);
  };

  // Função para calcular o preço com desconto
  const calculateDiscountedPrice = (price: number, discountPercentage: number): number => {
    return price - (price * (discountPercentage / 100));
  };
  const discountedPrice = calculateDiscountedPrice(product.price, product.discountPercentage);

  return (
    <section key={product.id} className="w-full bg-taupe-50 p-2 rounded-lg border border-taupe-300 flex flex-col justify-between">
      <img 
        className="w-full rounded-lg max-h-60"
        alt="Imagem de exemplo"
        src={product.thumbnail ?? "https://via.placeholder.com/150"}
      />
      <p className="font-medium mt-1 my-2">{product.title}</p>
      <p className="text-taupe-700/90 line-through">
        {product.price.toLocaleString('pt-BR', { 
          style: 'currency',
          currency: 'BRL',
          minimumFractionDigits: 2 
        })}
      </p>

      <div className="flex items-center gap-3">
        <strong className="text-taupe-700/90">
          {discountedPrice.toLocaleString('pt-BR', { 
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2 
          })}
        </strong>
        <button 
          onClick={() => handleAddToCart(product)}
          className="bg-taupe-800 hover:bg-taupe-800/90 transition-colors p-1 rounded cursor-pointer"
        >
          <BsCartPlus size={20} color="#e8e4e3" />
        </button>
      </div>
    </section>
  );
}
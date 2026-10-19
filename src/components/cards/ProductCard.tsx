import { useContext } from "react";
import { CartContext } from "../../contexts/CartContext";
import toast from "react-hot-toast";
import type { ProductCardProps, ProductProps } from "../../types";
import { BsCartPlus } from "react-icons/bs";
import { Badge } from "../ui/badge";

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
      <div className="flex flex-nowrap gap-1">
        {/* Tags do produto */}
        {product.tags.map((tag, index) => (
          <div key={index}>
            <Badge text={tag} color="outline" size="small" />
          </div>
        ))}
      </div>

      {/* Imagem do produto */}
      <img 
        className="w-full rounded-lg max-h-60"
        alt="Imagem de exemplo"
        src={product.thumbnail ?? "https://via.placeholder.com/150"}
      />
      {/* Marca do produto */}
      <p className="text-taupe-500/90 text-sm">{product.brand}</p>
      {/* Nome do produto */}
      <p className="font-medium text-sm truncate">{product.title}</p>

      {/* Preço do produto + Valor sem desconto +_Bottão carrinho*/}
      <div className="flex items-center justify-between gap-2 mt-1">
        <div className="flex items-center gap-1">
          <strong className="text-taupe-700 text-sm">
            {discountedPrice.toLocaleString('pt-BR', { 
              style: 'currency',
              currency: 'BRL',
              minimumFractionDigits: 2 
            })}
          </strong>
          <p className="text-taupe-700/70 line-through text-sm font-bold">
            {product.price.toLocaleString('pt-BR', { 
              style: 'currency',
              currency: 'BRL',
              minimumFractionDigits: 2 
            })}
          </p>
        </div>

        {/* Botão para adicionar ao carrinho */}
        <button 
          onClick={() => handleAddToCart(product)}
          className="bg-transparent hover:bg-taupe-400 transition-colors p-1 rounded cursor-pointer"
        >
          <BsCartPlus size={20} color="#1d1816" />
        </button>
      </div>
      {/* Desconto */}
      <p className="text-taupe-700/90 text-sm">{product.discountPercentage}% OFF</p>
    </section>
  );
}
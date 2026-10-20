import { useContext } from "react";
import { CartContext } from "../../contexts/CartContext";
import toast from "react-hot-toast";
import type { ProductCardProps, ProductProps } from "../../types";
import { BsCartPlus } from "react-icons/bs";
import { Badge } from "../ui/badge";
import { useNavigate } from "react-router-dom";
import { MdFavoriteBorder } from "react-icons/md";
import { FavoriteContext } from "../../contexts/FavoriteContext";

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useContext(CartContext);
  const { addToFavorites } = useContext(FavoriteContext);
  const navigation = useNavigate();
  
  // Função para adicionar um produto ao carrinho
  const handleAddToCart = (product: ProductProps, event: React.MouseEvent) => {
    event.stopPropagation();
    addToCart(product);
    toast.success(`${product.title} adicionado ao carrinho!`);
  };

  // Função para adicionar um produto aos favoritos
  const handleAddToFavorites = (product: ProductProps, event: React.MouseEvent) => {
    event.stopPropagation();
    addToFavorites(product);
    toast.success(`${product.title} adicionado aos favoritos!`);
  };

  // Função para redirecionar para a página de detalhes do produto
  const handleViewProduct = (id: number) => {
    navigation(`/products/${id}`);
  };

  // Função para calcular o preço com desconto
  const calculateDiscountedPrice = (price: number, discountPercentage: number): number => {
    return price - (price * (discountPercentage / 100));
  };
  const discountedPrice = calculateDiscountedPrice(product.price, product.discountPercentage);

  return (
    <section 
      key={product.id} 
      onClick={() => handleViewProduct(product.id)}
      className="w-full bg-taupe-50 p-2 rounded-lg border border-taupe-300 flex flex-col justify-between transition-transform hover:scale-103 cursor-pointer"
    >
      <div className="flex flex-nowrap gap-1">
        {/* Tags do produto */}
        {product.tags.map((tag, index) => (
          <div key={index}>
            <Badge text={tag} color="outline" size="small" />
          </div>
        ))}
      </div>

      {/* Imagem do produto */}
      <div className="relative w-full h-60 group overflow-hidden mt-2">
        {/* Imagem principal */}
        <img 
          className="absolute inset-0 w-full rounded-lg max-h-60 object-cover transition-opacity duration-300 group-hover:opacity-0"
          alt="Imagem principal do produto"
          src={product.thumbnail ?? "https://via.placeholder.com/150"}
        />

        {/* Imagem secundária (hover) */}
        <img 
          className="absolute inset-0 w-full rounded-lg max-h-60 object-cover transition-opacity duration-300 opacity-0 group-hover:opacity-100"
          alt="Imagem secundária do produto"
          src={product.images[1] ?? product.thumbnail ?? "https://via.placeholder.com/150"}
        />
      </div>
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

        {/* Botões de ação */}
        <div className="flex items-center gap-1">
          {/* Botão para adicionar ao favorito */}
          <button 
            type="button"
            onClick={(event) => handleAddToFavorites(product, event)}
            className="bg-transparent hover:bg-taupe-400 transition-colors p-1 rounded cursor-pointer"
          >
            <MdFavoriteBorder size={20} color="#1d1816" />
          </button>

          {/* Botão para adicionar ao carrinho */}
          <button 
            type="button"
            onClick={(event) => handleAddToCart(product, event)}
            className="bg-transparent hover:bg-taupe-400 transition-colors p-1 rounded cursor-pointer"
          >
            <BsCartPlus size={20} color="#1d1816" />
          </button>
        </div>
      </div>
      {/* Desconto */}
      <p className="text-taupe-700/90 text-sm">{product.discountPercentage}% OFF</p>
    </section>
  );
}
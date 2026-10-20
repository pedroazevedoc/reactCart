import { MdFavorite } from "react-icons/md";
import { Container } from "../../components/container";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { FavoriteContext } from "../../contexts/FavoriteContext";
import toast from "react-hot-toast";
import { IoMdHeartDislike } from "react-icons/io";
import type { FavoriteProductProps, ProductProps } from "../../types";

// Formata um valor numérico no padrão de moeda brasileira
const formatCurrency = (value: number) =>
  value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });

// Formata a data e o horário em que o produto foi adicionado aos favoritos
const formatAddedAt = (date: string) =>
  new Date(date).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

// Calcula o preço com o desconto aplicado
const calculateDiscountedPrice = (product: ProductProps) =>
  product.price - (product.price * (product.discountPercentage / 100));

export function Favorites() {
  const { favorites, removeFromFavorites } = useContext(FavoriteContext);

  // Função para remover um produto dos favoritos
  const handleRemoveFromFavorites = (itemFavorite: FavoriteProductProps) => {
    removeFromFavorites(itemFavorite.product.id);
    toast.success(`${itemFavorite.product.title} removido dos favoritos!`);
  };

  // Função para exibir um componente de mensagem quando a lista está vazia
  const showTemporaryComponent = () => {
    if (favorites.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center space-y-2 h-64">
          <MdFavorite size={48} className="text-taupe-500" />
          <p className="font-bold text-taupe-500">Sua lista de favoritos está vazia.</p>
          <Link 
            to="/"
            className="bg-taupe-800 hover:bg-taupe-800/90 transition-colors p-2 rounded text-white flex items-center gap-2"
          >
            Acessar produtos
          </Link>
        </div>
      );
    }
  };

  return (
    <Container title="Favoritos">
      <div className="flex flex-col space-y-4">
        {/* Mensagem quando a lista de favoritos está vazia */}
        {showTemporaryComponent()}

        {/* Lista de produtos favoritados */}
        {favorites.map((itemFavorite) => (
          <section
            key={itemFavorite.product.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-taupe-50 border border-taupe-300 rounded-lg"
          >
            {/* Imagem | Informações */}
            <div className="flex items-center gap-4">
              {/* Imagem do produto (link para os detalhes) */}
              <Link to={`/products/${itemFavorite.product.id}`} className="shrink-0">
                <img
                  src={itemFavorite.product.thumbnail ?? "https://via.placeholder.com/150"}
                  alt={itemFavorite.product.title}
                  className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-md"
                />
              </Link>

              {/* Informações do produto */}
              <div className="flex flex-col gap-1 min-w-0">
                {/* Nome do produto (link para os detalhes) */}
                <Link
                  to={`/products/${itemFavorite.product.id}`}
                  className="font-medium hover:underline truncate"
                >
                  {itemFavorite.product.title}
                </Link>

                {/* Marca e categoria */}
                <p className="text-sm text-taupe-500 truncate">
                  {itemFavorite.product.brand} · {itemFavorite.product.category.charAt(0).toUpperCase() + itemFavorite.product.category.slice(1)}
                </p>

                {/* Preço com desconto */}
                <div className="flex flex-wrap items-center gap-2">
                  <strong className="text-sm text-taupe-700">
                    {formatCurrency(calculateDiscountedPrice(itemFavorite.product))}
                  </strong>
                  <p className="text-sm text-taupe-700/70 line-through font-bold">
                    {formatCurrency(itemFavorite.product.price)}
                  </p>
                  <p className="text-xs text-taupe-700/90">{itemFavorite.product.discountPercentage}% OFF</p>
                </div>

                {/* Data e horário em que foi adicionado aos favoritos */}
                <p className="text-xs text-taupe-500">
                  Adicionado em {formatAddedAt(itemFavorite.addedAt)}
                </p>
              </div>
            </div>

            {/* Botão de remoção */}
            <div className="flex sm:self-center">
              <button
                type="button"
                onClick={() => handleRemoveFromFavorites(itemFavorite)}
                className="bg-transparent text-red-500 hover:bg-red-100 transition-colors p-2 rounded-md cursor-pointer flex items-center gap-2 text-sm font-medium"
              >
                <IoMdHeartDislike size={18} />
                <span className="hidden sm:inline">Remover</span>
              </button>
            </div>
          </section>
        ))}
      </div>
    </Container>
  )
}
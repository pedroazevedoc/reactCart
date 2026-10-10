import { Container } from "../../components/container";
import type { ProductProps } from "../../types";
import { useEffect, useState } from "react";
import { api } from "../../services/api";
import toast from "react-hot-toast";
import { FaSpinner } from "react-icons/fa";
import { MdOutlineShoppingBag } from "react-icons/md";
import { ProductCard } from "../../components/cards/ProductCard";

export function Home() {
  const [ isLoading, setIsLoading ] = useState(false);
  const [ products, setProducts ] = useState<ProductProps[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setIsLoading(true);
        const response = await api.get("/products");
        setProducts(response.data.products);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
        toast.error("Erro ao buscar produtos. Por favor, tente novamente mais tarde.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Função para exibir um componente temporário de carregamento ou mensagem de nenhum produto encontrado
  const showTemporaryComponent = () => {
    // Mapeamento de status para ícones e mensagens
    const temporaryStatusMap = {
      loading: {
        icon: <FaSpinner className="animate-spin text-taupe-800" size={48} />,
        message: "Carregando produtos..."
      },
      empty: {
        icon: <MdOutlineShoppingBag className="text-taupe-800" size={48} />,
        message: "Nenhum produto encontrado."
      }
    };

    // Determina o status atual com base no estado de carregamento e na lista de produtos
    const status = isLoading ? "loading" : (products.length === 0 ? "empty" : null);

    if (status !== null) {
      return (
        <div className="flex flex-col justify-center items-center h-64 space-y-2">
          {temporaryStatusMap[status]?.icon}
          <p className="text-taupe-800">{temporaryStatusMap[status]?.message}</p>
        </div>
      );
    }
  };

  return (
    <Container title="Produtos">
      {/* Exibe o componente temporário */}
      {showTemporaryComponent()}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {products.map((product) => (
          <ProductCard product={product} />
        ))}
      </div>
    </Container>
  );
}
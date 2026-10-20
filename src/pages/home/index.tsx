import { useCallback, useEffect, useRef, useState } from "react";
import { Container } from "../../components/container";
import type { ProductProps } from "../../types";
import toast from "react-hot-toast";
import { FaSpinner } from "react-icons/fa";
import { MdOutlineShoppingBag } from "react-icons/md";
import { ProductCard } from "../../components/cards/ProductCard";
import { getProducts } from "../../services/products";

// Quantidade de produtos carregados por página no infinite scroll
const PAGE_SIZE = 10;

export function Home() {
  const [ products, setProducts ] = useState<ProductProps[]>([]);
  // null = primeira página ainda não carregada (a sentinela fica visível para iniciar a busca)
  const [ total, setTotal ] = useState<number | null>(null);
  // A primeira página já inicia em carregamento ao montar a tela
  const [ isLoading, setIsLoading ] = useState(true);
  const [ isLoadingMore, setIsLoadingMore ] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);

  // Indica se ainda existem produtos a carregar
  const hasMore = total === null || products.length < total;

  // Busca uma página de produtos e a adiciona à lista
  // Os states só são atualizados após o await, para não gerar renders em cascata nos efeitos
  const fetchProducts = useCallback(async (skip: number) => {
    // Evita requisições duplicadas enquanto uma página está sendo carregada
    if (loadingRef.current) return;
    loadingRef.current = true;
    try {
      const data = await getProducts({ limit: PAGE_SIZE, skip });
      setTotal(data.total);
      setProducts(prev => skip === 0 ? data.products : [ ...prev, ...data.products ]);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      toast.error("Erro ao buscar produtos. Por favor, tente novamente mais tarde.");
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
      loadingRef.current = false;
    }
  }, []);

  // Observa a sentinela no fim da lista para carregar a próxima página
  // Também dispara a primeira página: com a lista vazia, a sentinela fica visível
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        // Callback do observer: é permitido atualizar o state aqui
        setIsLoadingMore(products.length > 0);
        fetchProducts(products.length);
      }
    }, { rootMargin: "300px" }); // Busca antes do usuário chegar ao fim da lista

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, products.length, fetchProducts]);

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
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Indicador de carregamento da próxima página */}
      {isLoadingMore && (
        <div className="flex justify-center py-4">
          <FaSpinner className="animate-spin text-taupe-800" size={24} />
        </div>
      )}

      {/* Sentinela usada pelo IntersectionObserver para buscar mais produtos */}
      {hasMore && <div ref={sentinelRef} className="h-px" />}

      {/* Fim da lista */}
      {!isLoading && !hasMore && products.length > 0 && (
        <p className="text-center text-sm text-taupe-500 py-4">
          Todos os produtos foram carregados.
        </p>
      )}
    </Container>
  );
}

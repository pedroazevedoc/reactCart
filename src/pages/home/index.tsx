import { useCallback, useEffect, useRef, useState } from "react";
import { Container } from "../../components/container";
import type { ProductProps } from "../../types";
import toast from "react-hot-toast";
import { FaSpinner } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { MdOutlineShoppingBag } from "react-icons/md";
import { useSearchParams } from "react-router-dom";
import { ProductCard } from "../../components/cards/ProductCard";
import { getCategories, getProducts } from "../../services/products";
import type { ProductCategory, SortOrder } from "../../services/products";

const PAGE_SIZE = 10;
const SEARCH_DEBOUNCE_MS = 300;

// Opções de ordenação exibidas no select (value = "sortBy:order")
const SORT_OPTIONS = [
  { value: "", label: "Relevância" },
  { value: "price:asc", label: "Menor preço" },
  { value: "price:desc", label: "Maior preço" },
  { value: "rating:desc", label: "Melhor avaliação" },
  { value: "discountPercentage:desc", label: "Maior desconto" },
];

export function Home() {
  const [ searchParams, setSearchParams ] = useSearchParams();

  // Query da URL
  const query = searchParams.get("q") ?? "";
  // Ordenação da URL, no formato "sortBy:order" (ex.: "price:asc")
  const sort = searchParams.get("sort") ?? "";
  // Categoria da URL (slug)
  const category = searchParams.get("category") ?? "";
  // Busca ativa (após o debounce) usada nas requisições
  const [ activeQuery, setActiveQuery ] = useState(query);
  // Ordenação ativa (após o debounce) usada nas requisições
  const [ activeSort, setActiveSort ] = useState(sort);
  // Categoria ativa usada nas requisições
  const [ activeCategory, setActiveCategory ] = useState(category);

  // Categorias disponíveis para o filtro
  const [ categories, setCategories ] = useState<ProductCategory[]>([]);

  const [ products, setProducts ] = useState<ProductProps[]>([]);
  // null = primeira página ainda não carregada (a sentinela fica visível para iniciar a busca)
  const [ total, setTotal ] = useState<number | null>(null);

  const [ isLoading, setIsLoading ] = useState(true);
  const [ isLoadingMore, setIsLoadingMore ] = useState(false);

  // Referência para a sentinela que dispara o carregamento de mais produtos
  const sentinelRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<AbortController | null>(null);
  const inFlightRef = useRef<string | null>(null);

  // Indica se ainda existem produtos a carregar
  const hasMore = total === null || products.length < total;

  // Atualiza um parâmetro na URL (replace: não polui o histórico)
  const updateParam = (key: string, value: string) => {
    setSearchParams(prev => {
      const params = new URLSearchParams(prev);
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      return params;
    }, { replace: true });
  };

  // Atualiza a busca na URL a cada tecla
  const handleSearchChange = (value: string) => updateParam("q", value);

  // Atualiza a ordenação na URL imediatamente (não precisa de debounce)
  const handleSortChange = (value: string) => updateParam("sort", value);

  // Troca a categoria ativa no filtro (clicar na categoria selecionada a remove)
  const handleCategoryChange = (slug: string) => {
    updateParam("category", slug === category ? "" : slug);
  };

  // Carrega as categorias uma única vez para montar o filtro
  useEffect(() => {
    const controller = new AbortController();
    getCategories(controller.signal)
      .then(setCategories)
      .catch((error) => {
        if (controller.signal.aborted) return;
        console.error("Erro ao buscar categorias:", error);
      });
    return () => controller.abort();
  }, []);

  // Espera o usuário parar de digitar para aplicar a busca e limpar os resultados antigos
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (activeQuery === query) return;
      setActiveQuery(query);
      setProducts([]);
      setTotal(null);
      setIsLoading(true);
      setIsLoadingMore(false);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timeout);
  }, [query, activeQuery]);

  // Aplica a ordenação e limpa os resultados antigos
  // O timeout (0ms) mantém a atualização fora do corpo síncrono do efeito
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (activeSort === sort) return;
      setActiveSort(sort);
      setProducts([]);
      setTotal(null);
      setIsLoading(true);
      setIsLoadingMore(false);
    }, 0);
    return () => clearTimeout(timeout);
  }, [sort, activeSort]);

  // Aplica a categoria e limpa os resultados antigos (resposta imediata ao clique)
  // O timeout (0ms) mantém a atualização fora do corpo síncrono do efeito
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (activeCategory === category) return;
      setActiveCategory(category);
      setProducts([]);
      setTotal(null);
      setIsLoading(true);
      setIsLoadingMore(false);
    }, 0);
    return () => clearTimeout(timeout);
  }, [category, activeCategory]);

  // Busca uma página de produtos
  const fetchProducts = useCallback(async (skip: number, q: string, sortOption: string, categorySlug: string) => {
    const search = q.trim();
    // Converte "sortBy:order" em parâmetros separados
    const [ sortBy, order ] = sortOption ? sortOption.split(":") : [ "", "" ];
    const key = `${search}:${categorySlug}:${sortOption}:${skip}`;

    // A mesma requisição já está em andamento
    if (inFlightRef.current === key) return;

    // Cancela a requisição anterior para evitar respostas fora de ordem
    controllerRef.current?.abort();
    inFlightRef.current = key;
    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      const data = await getProducts(
        {
          q: search || undefined,
          category: categorySlug || undefined,
          sortBy: sortBy || undefined,
          order: (order as SortOrder) || undefined,
          limit: PAGE_SIZE,
          skip,
        },
        controller.signal
      );
      if (controller.signal.aborted) return;

      setTotal(data.total);
      setProducts(prev => skip === 0 ? data.products : [ ...prev, ...data.products ]);
      setIsLoading(false);
      setIsLoadingMore(false);
    } catch (error) {
      if (controller.signal.aborted) return;

      console.error("Erro ao buscar produtos:", error);
      toast.error("Erro ao buscar produtos. Por favor, tente novamente mais tarde.");
      setIsLoading(false);
      setIsLoadingMore(false);
    } finally {
      if (inFlightRef.current === key) {
        inFlightRef.current = null;
      }
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
        fetchProducts(products.length, activeQuery, activeSort, activeCategory);
      }
    }, { rootMargin: "300px" }); // Busca antes do usuário chegar ao fim da lista

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, products.length, activeQuery, activeSort, activeCategory, fetchProducts]);

  // Nome legível da categoria ativa
  const activeCategoryName = categories.find(item => item.slug === category)?.name;

  // Função para exibir um componente temporário de carregamento ou mensagem de nenhum produto encontrado
  const showTemporaryComponent = () => {
    // Mensagem de vazio conforme os filtros ativos
    const emptyMessage = query.trim()
      ? `Nenhum produto encontrado para “${query.trim()}”.`
      : activeCategoryName
        ? `Nenhum produto encontrado em ${activeCategoryName}.`
        : "Nenhum produto encontrado.";

    // Mapeamento de status para ícones e mensagens
    const temporaryStatusMap = {
      loading: {
        icon: <FaSpinner className="animate-spin text-taupe-800" size={48} />,
        message: "Carregando produtos..."
      },
      empty: {
        icon: <MdOutlineShoppingBag className="text-taupe-800" size={48} />,
        message: emptyMessage
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
      {/* Busca e ordenação */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4 max-w-3xl mx-auto">
        {/* Input de busca de produtos */}
        <div className="relative flex-1">
          <FiSearch
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-taupe-500"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => handleSearchChange(event.target.value)}
            placeholder="Buscar produtos pelo nome..."
            aria-label="Buscar produtos"
            className="w-full pl-9 pr-4 py-2 text-sm bg-taupe-50 border border-taupe-300 rounded-lg text-taupe-800 placeholder:text-taupe-500 focus:outline-none focus:border-taupe-800 transition-colors"
          />
        </div>

        {/* Select de ordenação */}
        <select
          value={sort}
          onChange={(event) => handleSortChange(event.target.value)}
          aria-label="Ordenar produtos"
          className="w-full sm:w-48 py-2 px-3 text-sm bg-taupe-50 border border-taupe-300 rounded-lg text-taupe-800 focus:outline-none focus:border-taupe-800 transition-colors cursor-pointer"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Filtro por categoria */}
      {categories.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 mb-4 max-w-4xl mx-auto">
          <button
            type="button"
            onClick={() => handleCategoryChange("")}
            aria-pressed={!category}
            className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors cursor-pointer ${
              !category
                ? "bg-taupe-800 text-taupe-50 border-taupe-800"
                : "bg-transparent text-taupe-800 border-taupe-300 hover:border-taupe-800"
            }`}
          >
            Todas
          </button>

          {categories.map((item) => (
            <button
              key={item.slug}
              type="button"
              onClick={() => handleCategoryChange(item.slug)}
              aria-pressed={category === item.slug}
              className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors cursor-pointer ${
                category === item.slug
                  ? "bg-taupe-800 text-taupe-50 border-taupe-800"
                  : "bg-transparent text-taupe-800 border-taupe-300 hover:border-taupe-800"
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>
      )}

      {/* Quantidade de resultados dos filtros ativos */}
      {!isLoading && total !== null && (query.trim() || activeCategoryName) && (
        <p className="text-center text-sm text-taupe-500 mb-4">
          {total} {total === 1 ? "resultado" : "resultados"}
          {query.trim() && ` para “${query.trim()}”`}
          {activeCategoryName && ` em ${activeCategoryName}`}
        </p>
      )}

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

import { BsCartPlus } from "react-icons/bs";
import { Container } from "../../components/container";
import type { ProductProps } from "../../types";
import { useContext, useEffect, useState } from "react";
import { api } from "../../services/api";
import { CartContext } from "../../contexts/CartContext";
import toast from "react-hot-toast";

export function Home() {
  const { addToCart } = useContext(CartContext);
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

  const handleAddToCart = (product: ProductProps) => {
    addToCart(product);
    toast.success(`${product.title} adicionado ao carrinho!`);
  };

  return (
    <Container title="Produtos">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {isLoading && (
          <p>Carregando produtos...</p>
        )} 
        {(products.length === 0 && !isLoading) && (
          <p>Nenhum produto encontrado.</p>
        )}
        {products.map((product) => (
          <section key={product.id} className="w-full">
            <img 
              className="w-full rounded-lg max-h-60 mb-2"
              alt="Imagem de exemplo"
              src={product.thumbnail}
            />
            <p className="font-medium mt-1 mb-2">{product.title}</p>

            <div className="flex items-center gap-3">
              <strong className="text-taupe-700/90">
                {product.price.toLocaleString('pt-BR', { 
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
        ))}
      </div>
    </Container>
  );
}
import { useContext, useEffect, useState } from "react";
import { Container } from "../../components/container";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../services/api";
import toast from "react-hot-toast";
import { FaRegStar, FaShieldAlt, FaSpinner, FaStar, FaTruck, FaUndo } from "react-icons/fa";
import { MdOutlineShoppingBag } from "react-icons/md";
import { BsCartPlus } from "react-icons/bs";
import type { ProductProps } from "../../types";
import { Badge } from "../../components/ui/badge";
import { CartContext } from "../../contexts/CartContext";

// Formata um valor numérico no padrão de moeda brasileira
const formatCurrency = (value: number) =>
  value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });

// Formata uma data ISO para o padrão brasileiro
const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

// Traduz o status de disponibilidade do produto para português
const availabilityMap: Record<string, { label: string; color: "success" | "warning" | "error" }> = {
  "In Stock": { label: "Em estoque", color: "success" },
  "Low Stock": { label: "Estoque baixo", color: "warning" },
  "Out of Stock": { label: "Sem estoque", color: "error" },
};

// Exibe a nota de uma avaliação em formato de estrelas
function RatingStars({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, index) =>
        index < Math.round(rating) ? (
          <FaStar key={index} size={size} className="text-yellow-400" />
        ) : (
          <FaRegStar key={index} size={size} className="text-taupe-300" />
        )
      )}
    </div>
  );
}

// Item técnico exibido na grade de especificações
function SpecItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-taupe-50 border border-taupe-300 rounded-lg p-3">
      <p className="text-xs text-taupe-500">{label}</p>
      <p className="text-sm font-medium text-taupe-800 mt-1 wrap-break-word">{value ?? "N/A"}</p>
    </div>
  );
}

// Linha de informação com ícone (entrega, garantia e devolução)
function InfoRow({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3 text-sm text-taupe-600">
      <span className="shrink-0 text-taupe-800">{icon}</span>
      <span>{text}</span>
    </div>
  );
}

export function Product() {
  const [ isLoading, setIsLoading ] = useState(false);
  const [ product, setProduct ] = useState<ProductProps | null>(null);
  const [ selectedImage, setSelectedImage ] = useState<string | null>(null);
  const { id } = useParams();
  const navigation = useNavigate();
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    async function fetchProduct() {
      try {
        setIsLoading(true);
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
        setSelectedImage(null);
      } catch (error) {
        console.error("Erro ao buscar detalhes do produto: ", error);
        navigation('/', { replace: true });
        toast.error("Erro ao buscar detalhes do produto. Por favor, tente novamente mais tarde.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchProduct();
  }, [id, navigation]);

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
        message: "Produto não encontrado."
      }
    };

    // Determina o status atual com base no estado de carregamento e na lista de produtos
    const status = isLoading ? "loading" : (product ? null : "empty");

    if (status !== null) {
      return (
        <div className="flex flex-col justify-center items-center h-64 space-y-2">
          {temporaryStatusMap[status].icon}
          <p className="text-taupe-800">{temporaryStatusMap[status].message}</p>
        </div>
      );
    }
  };

  // Adiciona o produto exibido ao carrinho
  const handleAddToCart = (product: ProductProps) => {
    addToCart(product);
    toast.success(`${product.title} adicionado ao carrinho!`);
  };

  // Preço com desconto aplicado
  const discountedPrice = product
    ? product.price - (product.price * (product.discountPercentage / 100))
    : 0;

  // Imagem principal da galeria (miniatura por padrão)
  const mainImage = selectedImage ?? product?.thumbnail ?? product?.images[0];

  // Disponibilidade traduzida do produto
  const availability = product
    ? availabilityMap[product.availabilityStatus] ?? { label: product.availabilityStatus, color: "warning" as const }
    : null;

  return (
    <Container title="Produto">
      {/* Exibe o componente temporário */}
      {showTemporaryComponent()}

      {product && (
        <div className="flex flex-col gap-8">
          {/* Imagem e informações principais */}
          <section className="flex flex-col md:flex-row gap-6">
            {/* Galeria de imagens */}
            <div className="w-full md:w-1/2">
              <div className="w-full h-72 md:h-120 overflow-hidden rounded-lg border border-taupe-300 bg-taupe-50">
                <img
                  src={mainImage ?? "https://via.placeholder.com/300"}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Miniaturas */}
              {product.images.length > 1 && (
                <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                  {product.images.map((image, index) => (
                    <button
                      type="button"
                      key={index}
                      onClick={() => setSelectedImage(image)}
                      className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors cursor-pointer ${
                        image === mainImage
                          ? "border-taupe-800"
                          : "border-taupe-300 hover:border-taupe-500"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.title} - imagem ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Informações do produto */}
            <div className="w-full md:w-1/2 flex flex-col gap-3">
              {/* Tags */}
              {product.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {product.tags.map((tag, index) => (
                    <Badge key={index} text={tag} color="outline" size="small" />
                  ))}
                </div>
              )}

              {/* Marca e referência */}
              <p className="text-sm text-taupe-500">
                {product.brand || "Marca não disponível"} · Ref. #{product.id}
              </p>

              {/* Nome do produto */}
              <h2 className="text-2xl md:text-3xl font-bold text-taupe-800 leading-tight">
                {product.title}
              </h2>

              {/* Avaliação */}
              <div className="flex flex-wrap items-center gap-2">
                <RatingStars rating={product.rating} />
                <span className="text-sm font-medium text-taupe-700">{product.rating.toFixed(1)}</span>
                <span className="text-sm text-taupe-500">({product.reviews.length} avaliações)</span>
              </div>

              {/* Preço */}
              <div className="flex flex-wrap items-end gap-2 mt-1">
                <strong className="text-2xl font-bold text-taupe-700">
                  {formatCurrency(discountedPrice)}
                </strong>
                <span className="text-sm font-bold text-taupe-700/70 line-through">
                  {formatCurrency(product.price)}
                </span>
                <Badge text={`${product.discountPercentage}% OFF`} color="warning" size="small" />
              </div>

              {/* Disponibilidade */}
              {availability && (
                <div className="flex flex-wrap items-center gap-2">
                  <Badge text={availability.label} color={availability.color} size="small" />
                  <span className="text-sm text-taupe-600">{product.stock} unidades disponíveis</span>
                </div>
              )}

              {/* Descrição */}
              <p className="text-taupe-600 leading-relaxed">{product.description}</p>

              {/* Adicionar ao carrinho */}
              <button
                type="button"
                onClick={() => handleAddToCart(product)}
                className="w-full md:w-auto mt-2 flex items-center justify-center gap-2 bg-taupe-800 hover:bg-taupe-800/90 text-taupe-50 font-medium px-6 py-3 rounded-lg transition-colors cursor-pointer"
              >
                <BsCartPlus size={20} />
                Adicionar ao carrinho
              </button>

              <p className="text-xs text-taupe-500">
                Pedido mínimo de {product.minimumOrderQuantity} unidades
              </p>

              {/* Entrega, garantia e devolução */}
              <div className="flex flex-col gap-2 mt-2 pt-4 border-t border-taupe-300">
                <InfoRow icon={<FaTruck size={18} />} text={product.shippingInformation} />
                <InfoRow icon={<FaShieldAlt size={18} />} text={product.warrantyInformation} />
                <InfoRow icon={<FaUndo size={18} />} text={product.returnPolicy} />
              </div>
            </div>
          </section>

          {/* Especificações técnicas */}
          <section>
            <h3 className="font-bold text-lg text-taupe-800 mb-3">Especificações</h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <SpecItem label="SKU" value={product.sku} />
              <SpecItem label="Marca" value={product.brand} />
              <SpecItem
                label="Categoria"
                value={product.category.charAt(0).toUpperCase() + product.category.slice(1)}
              />
              <SpecItem label="Peso" value={`${product.weight} g`} />
              <SpecItem
                label="Dimensões (L × A × P)"
                value={`${product.dimensions.width} × ${product.dimensions.height} × ${product.dimensions.depth} cm`}
              />
              <SpecItem label="Pedido mínimo" value={`${product.minimumOrderQuantity} unidades`} />
              <SpecItem label="Cadastrado em" value={formatDate(product.meta.createdAt)} />
              <SpecItem label="Atualizado em" value={formatDate(product.meta.updatedAt)} />
            </div>

            {/* Código de barras e QR Code */}
            <div className="flex items-center gap-4 mt-3 bg-taupe-50 border border-taupe-300 rounded-lg p-4">
              <img
                src={product.meta.qrCode}
                alt={`QR Code de ${product.title}`}
                className="w-20 h-20 rounded border border-taupe-300 bg-white p-1"
              />
              <div>
                <p className="text-sm font-medium text-taupe-800">QR Code do produto</p>
                <p className="text-xs text-taupe-500 mt-1">Código de barras</p>
                <p className="text-sm text-taupe-600 font-mono">{product.meta.barcode}</p>
              </div>
            </div>
          </section>

          {/* Avaliações dos clientes */}
          {product.reviews.length > 0 && (
            <section>
              <h3 className="font-bold text-lg text-taupe-800 mb-3">
                Avaliações ({product.reviews.length})
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {product.reviews.map((review, index) => (
                  <article
                    key={index}
                    className="bg-taupe-50 border border-taupe-300 rounded-lg p-4 flex flex-col gap-2"
                  >
                    {/* Avaliador */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 shrink-0 flex items-center justify-center rounded-full bg-taupe-800 text-taupe-50 text-xs font-medium">
                          {review.reviewerName
                            .split(" ")
                            .map((part) => part[0])
                            .slice(0, 2)
                            .join("")
                            .toUpperCase()}
                        </span>
                        <div>
                          <p className="text-sm font-medium text-taupe-800">{review.reviewerName}</p>
                          <p className="text-xs text-taupe-500">{formatDate(review.date)}</p>
                        </div>
                      </div>

                      <RatingStars rating={review.rating} size={12} />
                    </div>

                    {/* Comentário */}
                    <p className="text-sm text-taupe-600">{review.comment}</p>
                  </article>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </Container>
  );
}

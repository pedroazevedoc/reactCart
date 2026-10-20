import { TfiLayoutLineSolid, TfiPlus, TfiTrash } from "react-icons/tfi";
import { Container } from "../../components/container";
import { useContext } from "react";
import { CartContext } from "../../contexts/CartContext";
import { Link } from "react-router-dom";
import { MdOutlineRemoveShoppingCart } from "react-icons/md";
import toast from "react-hot-toast";
import type { CartProductProps } from "../../types";

// Formata um valor numérico no padrão de moeda brasileira
const formatCurrency = (value: number) =>
  value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });

export function Cart() {
  const { cart, cartTotal, addToCart, removeFromCart } = useContext(CartContext);

  // Quantidade total de unidades no carrinho
  const totalAmount = cart.reduce((total, item) => total + item.amount, 0);

  // Função para aumentar a quantidade de um produto no carrinho
  const handleAddToCart = (itemCart: CartProductProps) => {
    addToCart(itemCart.product);
    toast.success(`${itemCart.product.title} adicionado ao carrinho!`);
  };

  // Função para diminuir a quantidade ou remover um produto do carrinho
  const handleRemoveFromCart = (itemCart: CartProductProps, removeAll: boolean) => {
    removeFromCart(itemCart.product.id, removeAll);
    toast.success(
      removeAll || itemCart.amount === 1
        ? `${itemCart.product.title} removido do carrinho!`
        : `Quantidade de ${itemCart.product.title} reduzida.`
    );
  };

  // Função para exibir um componente quando o carrinho está vazio
  const showTemporaryComponent = () => {
    if (cart.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center space-y-2 h-64">
          <MdOutlineRemoveShoppingCart size={48} className="text-taupe-500" />
          <p className="font-bold text-taupe-500">Seu carrinho está vazio.</p>
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
    <Container title="Carrinho">
      <div className="flex flex-col space-y-4">
        {/* Mensagem quando o carrinho está vazio */}
        {showTemporaryComponent()}

        {/* Lista de produtos */}
        {cart.map((itemCart) => (
          <section
            key={itemCart.product.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-taupe-50 border border-taupe-300 rounded-lg"
          >
            {/* Imagem | Informações */}
            <div className="flex items-center gap-4">
              {/* Imagem do produto (link para os detalhes) */}
              <Link to={`/products/${itemCart.product.id}`} className="shrink-0">
                <img
                  src={itemCart.product.thumbnail ?? "https://via.placeholder.com/150"}
                  alt={itemCart.product.title}
                  className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-md"
                />
              </Link>

              {/* Informações do produto */}
              <div className="flex flex-col gap-1 min-w-0">
                {/* Nome do produto (link para os detalhes) */}
                <Link
                  to={`/products/${itemCart.product.id}`}
                  className="font-medium hover:underline truncate"
                >
                  {itemCart.product.title}
                </Link>

                {/* Marca e categoria */}
                <p className="text-sm text-taupe-500 truncate">
                  {itemCart.product.brand} · {itemCart.product.category.charAt(0).toUpperCase() + itemCart.product.category.slice(1)}
                </p>

                {/* Valor unitário */}
                <p className="text-sm text-taupe-600">
                  {formatCurrency(itemCart.price)} un.
                </p>
              </div>
            </div>

            {/* Quantidade | Subtotal | Remoção */}
            <div className="flex items-center justify-between sm:justify-end gap-4">
              {/* Controle de quantidade | Subtotal */}
              <div className="flex flex-col items-start sm:items-center gap-2">
                {/* Controle de quantidade */}
                <div className="flex items-center gap-3 p-1 bg-taupe-100 rounded-md">
                  <button
                    type="button"
                    onClick={() => handleRemoveFromCart(itemCart, false)}
                    className="flex items-center justify-center bg-taupe-700 text-white hover:bg-taupe-800 transition-colors px-2 py-2 rounded-md cursor-pointer"
                  >
                    <TfiLayoutLineSolid size={14} />
                  </button>
                  <span className="font-medium min-w-5 text-center">{itemCart.amount}</span>
                  <button
                    type="button"
                    disabled={itemCart.amount >= itemCart.product.stock}
                    onClick={() => handleAddToCart(itemCart)}
                    className="flex items-center justify-center bg-taupe-700 text-white hover:bg-taupe-800 transition-colors px-2 py-2 rounded-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <TfiPlus size={14} />
                  </button>
                </div>

                {/* Preço total do item no carrinho */}
                <p className="text-sm font-bold text-taupe-800">
                  Subtotal: {formatCurrency(itemCart.totalPrice)}
                </p>
              </div>

              {/* Botão de remoção */}
              <button
                type="button"
                onClick={() => handleRemoveFromCart(itemCart, true)}
                className="bg-transparent text-red-500 hover:bg-red-100 transition-colors p-2 rounded-md cursor-pointer flex items-center gap-2 text-sm font-medium"
              >
                <TfiTrash size={18} />
                <span className="hidden sm:inline">Remover</span>
              </button>
            </div>
          </section>
        ))}

        {/* Resumo do carrinho */}
        {cart.length > 0 && (
          <div className="flex flex-col gap-1 p-4 bg-taupe-50 border border-taupe-300 rounded-lg sm:w-80 sm:self-end">
            <p className="text-sm text-taupe-500">Produtos: {totalAmount}</p>
            <div className="flex items-center justify-between font-bold text-taupe-800">
              <span>Total</span>
              <span>{cartTotal}</span>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
}

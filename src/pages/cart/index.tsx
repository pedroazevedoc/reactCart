import { TfiLayoutLineSolid, TfiPlus, TfiTrash } from "react-icons/tfi";
import { Container } from "../../components/container";
import { useContext } from "react";
import { CartContext } from "../../contexts/CartContext";
import { Link } from "react-router-dom";
import { MdOutlineRemoveShoppingCart } from "react-icons/md";
import type { ProductProps } from "../../types";
import toast from "react-hot-toast";

export function Cart() {
  const { cart, cartTotal, addToCart, removeFromCart } = useContext(CartContext);

  // Função para adicionar um produto ao carrinho
  const handleAddToCart = (product: ProductProps) => {
    addToCart(product);
    toast.success(`${product.title} adicionado ao carrinho!`);
  };

  // Função para remover um produto do carrinho
  const handleRemoveFromCart = (productId: number) => {
    removeFromCart(productId);
    toast.success(`Produto removido do carrinho!`);
  };

  // Função para exibir um componente
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
            className="flex items-center justify-between p-2 bg-taupe-50 border-b-2 rounded-t-lg border-taupe-300"
          >
            {/* Imagem | Nome | Preço */}
            <div className="flex items-center gap-4 w-2/3 sm:w-1/2">
              <img
                src={itemCart.product.thumbnail}
                alt={itemCart.product.title}
                className="w-24 object-cover rounded-md"
              />
              <div className="flex flex-col gap-2">
                <p className="font-medium">{itemCart.product.title}</p>
                <p className="text-taupe-500">
                  {itemCart.product.price.toLocaleString('pt-BR', { 
                    style: 'currency',
                    currency: 'BRL',
                    minimumFractionDigits: 2 
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 w-1/3 sm:w-1/2">
              {/* Controle de quantidade | Total */}
              <div className="flex flex-col items-center gap-2">
                {/* Controle de quantidade */}
                <div className="flex items-center gap-3 p-1 bg-taupe-100 rounded-md">
                  <button
                    onClick={() => handleRemoveFromCart(itemCart.product.id)}
                    className="flex items-center justify-center bg-taupe-700 text-white hover:bg-taupe-800 transition-colors px-2 py-2 rounded-md cursor-pointer"
                  >
                    <TfiLayoutLineSolid size={14} />
                  </button>
                  <span className="font-medium">{itemCart.amount}</span>
                  <button
                    onClick={() => handleAddToCart(itemCart.product)}
                    className="flex items-center justify-center bg-taupe-700 text-white hover:bg-taupe-800 transition-colors  px-2 py-2 rounded-md cursor-pointer"
                  >
                    <TfiPlus size={14} />
                  </button>
                </div>

                {/* Preço total do item no carrinho */}
                <p className="font-bold">
                  Subtotal: {itemCart.totalPrice.toLocaleString('pt-BR', { 
                    style: 'currency',
                    currency: 'BRL',
                    minimumFractionDigits: 2 
                  })}
                </p>
              </div>

              {/* Botão de remoção */}
              <button
                onClick={() => handleRemoveFromCart(itemCart.product.id)}
                className="bg-transparent text-red-500 hover:bg-red-100 transition-colors px-2 py-2 rounded-md  cursor-pointer"
              >
                <TfiTrash size={18} />
              </button>
            </div>
          </section>
        ))}

        {/* Total */}
        {cart.length > 0 && (
          <div className="flex justify-end my-4">
            <p className="font-bold">
              Total: {cartTotal}
            </p>
          </div>
        )}
      </div>
    </Container>
  );
}
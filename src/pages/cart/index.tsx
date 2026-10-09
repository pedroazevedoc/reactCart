import { TfiLayoutLineSolid, TfiPlus, TfiTrash } from "react-icons/tfi";
import { Container } from "../../components/container";
import { useContext } from "react";
import { CartContext } from "../../contexts/CartContext";
import { Link } from "react-router-dom";
import { MdOutlineRemoveShoppingCart } from "react-icons/md";

export function Cart() {
  const { cart } = useContext(CartContext);

  return (
    <Container title="Carrinho">
      <div className="flex flex-col space-y-4">
        {/* Mensagem quando o carrinho está vazio */}
        {cart.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2">
            <MdOutlineRemoveShoppingCart size={48} className="text-taupe-500" />
            <p className="font-bold text-taupe-500">Seu carrinho está vazio.</p>
            <Link 
              to="/"
              className="bg-taupe-800 hover:bg-taupe-800/90 transition-colors p-2 rounded text-white flex items-center gap-2"
            >
              Acessar produtos
            </Link>
          </div>
        )}

        {/* Lista de produtos */}
        {cart.map((itemCart) => (
          <section
            key={itemCart.product.id}
            className="flex items-center justify-between p-2 bg-taupe-50 border-b-2 rounded-t-lg border-taupe-300"
          >
            {/* Imagem | Nome | Preço */}
            <div className="flex items-center gap-4">
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

            {/* Controle de quantidade | Total */}
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-3 p-1 bg-taupe-100 rounded-md">
                <button className="flex items-center justify-center bg-taupe-700 text-white px-2 py-2 rounded-md hover:bg-taupe-800 transition-colors">
                  <TfiLayoutLineSolid size={14} />
                </button>
                <span className="font-medium">{itemCart.quantity}</span>
                <button className="flex items-center justify-center bg-taupe-700 text-white px-2 py-2 rounded-md hover:bg-taupe-800 transition-colors">
                  <TfiPlus size={14} />
                </button>
              </div>
              <p className="font-bold">
                Subtotal: {itemCart.product.price.toLocaleString('pt-BR', { 
                  style: 'currency',
                  currency: 'BRL',
                  minimumFractionDigits: 2 
                })}
              </p>
            </div>

            {/* Botão de remoção */}
            <button className="bg-transparent text-red-500 hover:bg-red-100 px-2 py-2 rounded-md transition-colors">
              <TfiTrash size={18} />
            </button>
          </section>
        ))}

        {/* Total */}
        {cart.length > 0 && (
          <div className="flex justify-end mt-4">
            <p className="font-bold">
              Total: {cart.reduce((acc, product) => acc + product.price, 0).toLocaleString('pt-BR', { 
                style: 'currency',
                currency: 'BRL',
                minimumFractionDigits: 2 
              })}
            </p>
          </div>
        )}
        {/* <p className="font-bold">
          Total: {cart.reduce((acc, product) => acc + product.price, 0).toLocaleString('pt-BR', { 
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2 
          })}
        </p> */}
      </div>
    </Container>
  );
}
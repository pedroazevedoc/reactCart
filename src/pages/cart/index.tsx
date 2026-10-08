import { TfiLayoutLineSolid, TfiPlus, TfiTrash } from "react-icons/tfi";
import { Container } from "../../components/container";

const products = [
  {
    id: 1,
    name: "Produto de exemplo 1",
    price: 100.0,
    image: "https://via.placeholder.com/150",
  },
  {
    id: 2,
    name: "Produto de exemplo 2",
    price: 50.0,
    image: "https://via.placeholder.com/150",
  },
  {
    id: 3,
    name: "Produto de exemplo 3",
    price: 75.0,
    image: "https://via.placeholder.com/150",
  },
  {
    id: 4,
    name: "Produto de exemplo 4",
    price: 120.0,
    image: "https://via.placeholder.com/150",
  },
  {
    id: 5,
    name: "Produto de exemplo 5",
    price: 80.0,
    image: "https://via.placeholder.com/150",
  },
];

export function Cart() {
  return (
    <Container title="Carrinho">
      <div className="flex flex-col space-y-4">
        {/* Lista de produtos */}
        {products.map((product) => (
          <section
            key={product.id}
            className="flex items-center justify-between p-2 bg-taupe-50 border-b-2 rounded-t-lg border-taupe-300"
          >
            {/* Imagem | Nome | Preço */}
            <div className="flex items-center gap-4">
              <img
                src={product.image}
                alt={product.name}
                className="w-24 object-cover rounded-md"
              />
              <div className="flex flex-col gap-2">
                <p className="font-medium">{product.name}</p>
                <p className="text-taupe-500">R$ {product.price.toFixed(2)}</p>
              </div>
            </div>

            {/* Controle de quantidade | Total */}
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-3 p-1 bg-taupe-100 rounded-md">
                <button className="flex items-center justify-center bg-taupe-700 text-white px-2 py-2 rounded-md hover:bg-taupe-800 transition-colors">
                  <TfiLayoutLineSolid size={14} />
                </button>
                <span className="font-medium">1</span>
                <button className="flex items-center justify-center bg-taupe-700 text-white px-2 py-2 rounded-md hover:bg-taupe-800 transition-colors">
                  <TfiPlus size={14} />
                </button>
              </div>
              <p className="font-bold">Subtotal: R$ {product.price.toFixed(2)}</p>
            </div>

            {/* Botão de remoção */}
            <button className="bg-transparent text-red-500 hover:bg-red-100 px-2 py-2 rounded-md transition-colors">
              <TfiTrash size={18} />
            </button>
          </section>
        ))}

        {/* Total */}
        <p className="font-bold">
          Total: R$ {products.reduce((acc, product) => acc + product.price, 0).toFixed(2)}
        </p>
      </div>
    </Container>
  );
}
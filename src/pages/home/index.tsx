import { BsCartPlus } from "react-icons/bs";
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
  {
    id: 6,
    name: "Produto de exemplo 6",
    price: 90.0,
    image: "https://via.placeholder.com/150",
  },
  {
    id: 7,
    name: "Produto de exemplo 7",
    price: 50.0,
    image: "https://via.placeholder.com/150",
  },
  {
    id: 8,
    name: "Produto de exemplo 8",
    price: 60.0,
    image: "https://via.placeholder.com/150",
  },
  {
    id: 9,
    name: "Produto de exemplo 9",
    price: 150.0,
    image: "https://via.placeholder.com/150",
  },
  {
    id: 10,
    name: "Produto de exemplo 10",
    price: 110.0,
    image: "https://via.placeholder.com/150",
  },
];

export function Home() {
  return (
    <Container title="Produtos">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {products.map((product) => (
          <section key={product.id} className="w-full">
            <img 
              className="w-full rounded-lg max-h-60 mb-2"
              alt="Imagem de exemplo"
              src={product.image}
            />
            <p className="font-medium mt-1 mb-2">{product.name}</p>

            <div className="flex items-center gap-3">
              <strong className="text-taupe-700/90">R$ {product.price.toFixed(2)}</strong>
              <button className="bg-taupe-800 p-1 rounded">
                <BsCartPlus size={20} color="#e8e4e3" />
              </button>
            </div>
          </section>
        ))}
      </div>
    </Container>
  );
}
import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-56px)]">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-4">Página não encontrada</h2>
      <p className="text-lg mb-8">A página que você está procurando não existe.</p>
      <Link
        to="/"
        className="px-4 py-2 bg-taupe-500 text-taupe-50 rounded hover:bg-taupe-600 transition-colors"
      >
        Voltar para a página inicial
      </Link>
    </div>
  );
}
import { FiShoppingCart } from "react-icons/fi";
import { Link } from "react-router";

export function Header() {
  return (
    <header className="w-full px-1 bg-taupe-200">
      <nav className="w-full max-w-7xl h-14 flex items-center justify-between px-5 mx-auto">
        <Link className="text-xl font-bold" to="/" color="#1d1816">
          React Cart
        </Link>

        <Link className="relative" to="/cart">
          <FiShoppingCart size={24} color="#1d1816" />
          <span className="absolute -top-3 -right-3 px-2.5 bg-taupe-500 rounded-full w-6 h-6 flex items-center justify-center text-xs text-taupe-50">
            0
          </span>
        </Link>
      </nav>
    </header>
  );
}
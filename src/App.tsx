import { createBrowserRouter } from "react-router-dom";
import { Cart } from "./pages/cart";
import { Layout } from "./components/layout";
import { Home } from "./pages/home";

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/cart",
        element: <Cart />,
      },
    ],
  },
]);
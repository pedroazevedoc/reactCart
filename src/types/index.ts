// Propriedades do produto
export interface ProductProps {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand: string;
  sku: string;
  weight: number;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  reviews: {
    rating: number;
    comment: string;
    date: string;
    reviewerName: string;
    reviewerEmail: string;
  }[];
  returnPolicy: string;
  minimumOrderQuantity: number;
  meta: {
    createdAt: string;
    updatedAt: string;
    barcode: string;
    qrCode: string;
  }
  images: string[];
  thumbnail: string;
}

// Contexto do carrinho de compras
export interface CartContextData {
  cart: CartProductProps[];
  cartAmount: number;
  cartTotal: string;
  addToCart: (newItem: ProductProps) => void;
  removeFromCart: (productId: number, removeAll: boolean) => void;
}

// Produto do carrinho de compras
export interface CartProductProps {
  product: ProductProps;
  amount: number;
  price: number;
  totalPrice: number;
  addedAt: string;
  updatedAt: string;
}

// Propriedades do provedor do carrinho de compras
export interface CartProviderProps {
  children: React.ReactNode;
}

// Propriedades do componente ProductCard
export interface ProductCardProps {
  product: ProductProps;
}

// Contexto dos favoritos
export interface FavoriteContextData {
  favorites: FavoriteProductProps[];
  addToFavorites: (newItem: ProductProps) => void;
  removeFromFavorites: (productId: number) => void;
}

// Produto do favorito
export interface FavoriteProductProps {
  product: ProductProps;
  addedAt: string;
}

// Propriedades do provedor dos favoritos
export interface FavoriteProviderProps {
  children: React.ReactNode;
}
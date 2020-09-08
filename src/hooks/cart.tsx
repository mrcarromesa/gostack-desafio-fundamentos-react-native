import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}
interface CartContext {
  products: Product[];
  addToCart(item: Omit<Product, 'quantity'>): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      const productsSavedString = await AsyncStorage.getItem('gostack@cart');
      const productsSaved = productsSavedString
        ? JSON.parse(productsSavedString)
        : [];

      if (productsSaved.length > 0) {
        setProducts(productsSaved as Product[]);
      }
    }

    loadProducts();
  }, []);

  const storageItem = useCallback(async () => {
    await AsyncStorage.setItem('gostack@cart', JSON.stringify(products));
  }, [products]);

  const increment = useCallback(
    async id => {
      const oldProducts = [...products];
      const indexProduct = oldProducts.findIndex(p => p.id === id);

      oldProducts[indexProduct].quantity += 1;
      setProducts(oldProducts);
      storageItem();
    },
    [products, storageItem],
  );

  const decrement = useCallback(
    async id => {
      const oldProducts = [...products];
      const indexProduct = oldProducts.findIndex(p => p.id === id);

      oldProducts[indexProduct].quantity -= 1;
      setProducts(oldProducts);
      storageItem();
    },
    [products, storageItem],
  );

  const addToCart = useCallback(
    async product => {
      let productSet: Product = {} as Product;
      productSet = product;
      productSet.quantity = productSet.quantity > 0 ? productSet.quantity : 1;
      const indexProduct = products.findIndex(p => p.id === product.id);

      if (indexProduct >= 0) {
        await increment(product.id);
        return;
      }

      const oldProduct = [...products, product];

      setProducts(oldProduct as Product[]);
      storageItem();
    },
    [products, increment, storageItem],
  );

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };

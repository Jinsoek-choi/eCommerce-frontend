// context/CartContext.tsx
"use client";

import { useUser } from "./UserContext";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
  useCallback,
} from "react";
import axios from "@/context/axiosConfig";

axios.defaults.withCredentials = true;

function debounce(callback: (...args: any[]) => void, delay: number) {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => callback(...args), delay);
  };
}

interface CartItemOption {
  optionId?: number;
  optionType?: string;
  optionTitle?: string | null;
  optionValue?: string | null;
  colorCode?: string | null;
  sellPrice?: number;
  stock?: number;
}

interface CartItem {
  cartId: number;
  productId: number;
  productName: string;
  thumbnail: string;
  quantity: number;
  price: number;
  stock: number;
  soldOut: boolean;
  option?: CartItemOption | null;
}

interface CartContextType {
  cart: CartItem[];
  initialLoading: boolean;
  loadCart: () => void;
  addToCart: (
    productId: number,
    optionValue: string | null,
    quantity: number
  ) => void;
  updateQuantity: (cartId: number, quantity: number) => void;
  changeOption: (cartId: number, newOptionValue: string) => void;
  deleteItem: (cartId: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { user } = useUser();

  const isAdmin = user?.role?.toUpperCase() === "ADMIN";
  const [initialLoading, setInitialLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

  const loadCart = useCallback(() => {
    if (!user || !user.id || isAdmin) {
      setCart([]);
      setInitialLoading(false);
      return;
    }

    axios
      .get(`${API_URL}/api/cart`)
      .then((res) => setCart(res.data.items || []))
      .finally(() => {
        setInitialLoading(false);
      });
  }, [user, isAdmin, API_URL]);

  const debouncedLoadCart = useMemo(
    () => debounce(loadCart, 250),
    [loadCart]
  );

  /** ✅ A안 핵심: optionValue 문자열/ null */
  function addToCart(
    productId: number,
    optionValue: string | null,
    quantity: number
  ) {
    if (isAdmin || !user) return;

    const safeOptionValue = optionValue ?? null;

    axios
      .post(`${API_URL}/api/cart`, {
        productId,
        optionValue: safeOptionValue,
        quantity,
      })
      .then(() => debouncedLoadCart())
      .catch((err) => {
        console.error("장바구니 담기 실패:", err);
        alert("장바구니 담기 중 오류가 발생했습니다.");
      });
  }

  function updateQuantity(cartId: number, quantity: number) {
    if (isAdmin || !user) return;

    setCart((prev) =>
      prev.map((item) =>
        item.cartId === cartId ? { ...item, quantity } : item
      )
    );

    axios
      .put(`${API_URL}/api/cart/quantity`, { cartId, quantity })
      .then(() => debouncedLoadCart())
      .catch((err) => {
        console.error("수량 변경 실패:", err);
        loadCart();
      });
  }

  function changeOption(cartId: number, newOptionValue: string) {
    if (isAdmin || !user) return;

    setCart((prev) =>
      prev.map((item) => {
        if (item.cartId !== cartId) return item;
        return {
          ...item,
          option: {
            ...(item.option || {}),
            optionValue: newOptionValue,
          },
        };
      })
    );

    axios
      .put(`${API_URL}/api/cart/option`, { cartId, newOptionValue })
      .then(() => debouncedLoadCart())
      .catch((err) => {
        console.error("옵션 변경 실패:", err);
        loadCart();
      });
  }

  function deleteItem(cartId: number) {
    if (isAdmin || !user) return;

    axios
      .delete(`${API_URL}/api/cart/${cartId}`)
      .then(() => debouncedLoadCart())
      .catch((err) => {
        console.error("장바구니 삭제 실패:", err);
      });
  }

  function clearCart() {
    setCart([]);
  }

  useEffect(() => {
    if (!user || isAdmin) {
      setCart([]);
      setInitialLoading(false);
      return;
    }
    loadCart();
  }, [user, isAdmin, loadCart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        initialLoading,
        loadCart,
        addToCart,
        updateQuantity,
        changeOption,
        deleteItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};

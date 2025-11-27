"use client";

import { useUser } from "./UserContext";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

axios.defaults.withCredentials = true;

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

interface CartItem {
  cartId: number;
  productId: number;
  productName: string;
  thumbnail: string;
  quantity: number;
  price: number;
  stock: number;
  soldOut: boolean;
  option?: {
    optionId: number;
    optionType: string;
    optionTitle: string | null;
    optionValue: string | null;
  } | null;
}

interface CartContextType {
  cart: CartItem[];
  loadCart: () => void;
  addToCart: (
    product: {
      productId: number;
      productName: string;
      mainImg?: string;
      sellPrice: number;
      stock: number;
    },
    optionId: number | null,
    quantity: number
  ) => void;
  updateQuantity: (cartId: number, quantity: number) => void;
  changeOption: (cartId: number, newOptionId: number) => void;
  deleteItem: (cartId: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { user } = useUser();
  const isAdmin = user?.role?.toUpperCase() === "ADMIN";

  /** 서버에서 장바구니 불러오기 */
  const loadCart = () => {
    if (!user || !user.id || isAdmin) {
      setCart([]);
      localStorage.removeItem("cart");
      return;
    }

    axios
      .get(`${API_URL}/api/cart`)
      .then((res) => {
        const items: CartItem[] = res.data.items || [];
        setCart(items);
        localStorage.setItem("cart", JSON.stringify(items));
      })
      .catch((err) => {
        console.error("장바구니 불러오기 실패:", err);
        setCart([]);
        localStorage.removeItem("cart");
      });
  };

  /** 장바구니에 추가 */
  const addToCart = async (
    product: { productId: number; productName: string; mainImg?: string; sellPrice: number; stock: number },
    optionId: number | null,
    quantity: number
  ) => {
    if (!user || isAdmin) return;

    setCart((prevCart) => {
      const index = prevCart.findIndex(
        (item) => item.productId === product.productId && item.option?.optionId === optionId
      );

      let newCart: CartItem[];
      if (index >= 0) {
        // 기존 상품+옵션 수량 증가
        newCart = [...prevCart];
        newCart[index] = { ...newCart[index], quantity: newCart[index].quantity + quantity };
      } else {
        // 새 상품/옵션 추가
        newCart = [
          ...prevCart,
          {
            cartId: Date.now(), // 임시 ID
            productId: product.productId,
            productName: product.productName,
            thumbnail: product.mainImg || "",
            quantity,
            price: product.sellPrice,
            stock: product.stock,
            soldOut: product.stock === 0,
            option: optionId ? { optionId, optionType: "", optionTitle: null, optionValue: null } : null,
          },
        ];
      }

      localStorage.setItem("cart", JSON.stringify(newCart));
      return newCart;
    });

    try {
      await axios.post(`${API_URL}/api/cart`, {
        productId: product.productId,
        optionId,
        quantity,
      });
      loadCart(); // 서버 기준으로 최종 동기화
    } catch (err) {
      console.error("장바구니 담기 실패:", err);
    }
  };

  /** 수량 변경 */
  const updateQuantity = (cartId: number, quantity: number) => {
    if (!user || isAdmin) return;

    axios
      .put(`${API_URL}/api/cart/quantity`, { cartId, quantity })
      .then(() => loadCart())
      .catch((err) => console.error("수량 변경 실패:", err));
  };

  /** 옵션 변경 */
  const changeOption = (cartId: number, newOptionId: number) => {
    if (!user || isAdmin) return;

    axios
      .put(`${API_URL}/api/cart/option`, { cartId, newOptionId })
      .then(() => loadCart())
      .catch((err) => console.error("옵션 변경 실패:", err));
  };

  /** 항목 삭제 */
  const deleteItem = (cartId: number) => {
    if (!user || isAdmin) return;

    axios
      .delete(`${API_URL}/api/cart/${cartId}`)
      .then(() => loadCart())
      .catch((err) => console.error("아이템 삭제 실패:", err));
  };

  /** 장바구니 비우기 */
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
    if (user && !isAdmin) {
      axios.delete(`${API_URL}/api/cart`).catch((err) => console.error("장바구니 전체 삭제 실패:", err));
    }
  };

  /** 로그인/로그아웃 또는 role 변경 감지 */
  useEffect(() => {
    if (!user || !user.id || isAdmin) {
      setCart([]);
      localStorage.removeItem("cart");
      return;
    }
    loadCart();
  }, [user?.id, isAdmin]);

  return (
    <CartContext.Provider
      value={{
        cart,
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

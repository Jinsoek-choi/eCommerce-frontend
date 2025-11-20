"use client";

import { useUser } from "./UserContext";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

axios.defaults.withCredentials = true; // ★ 세션 쿠키 항상 포함

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
  loadCart: () => Promise<void>;
  addToCart: (productId: number, optionId: number | null, quantity: number) => Promise<void>;
  updateQuantity: (cartId: number, quantity: number) => Promise<void>;
  changeOption: (cartId: number, newOptionId: number) => Promise<void>;
  deleteItem: (cartId: number) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { user } = useUser();

  /** 장바구니 조회 **/
  async function loadCart() {
    try {
      const res = await axios.get("http://localhost:8080/api/cart");
      setCart(res.data.items);
    } catch (err: any) {
      if (err.response?.status === 401) {
        setCart([]); // 로그인 안된 경우
        return;
      }
      console.error("장바구니 조회 실패:", err);
    }
  }

  /** 장바구니 담기 */
  async function addToCart(productId: number, optionId: number | null, quantity: number) {
    await axios.post("http://localhost:8080/api/cart", {
      productId,
      optionId,
      quantity,
    });
    await loadCart();
  }

  /** 수량 변경 */
  async function updateQuantity(cartId: number, quantity: number) {
    await axios.put("http://localhost:8080/api/cart/quantity", {
      cartId,
      quantity,
    });
    await loadCart();
  }

  /** 옵션 변경 */
  async function changeOption(cartId: number, newOptionId: number) {
    await axios.put("http://localhost:8080/api/cart/option", {
      cartId,
      newOptionId,
    });
    await loadCart();
  }

  /** 장바구니 삭제 */
  async function deleteItem(cartId: number) {
    await axios.delete(`http://localhost:8080/api/cart/${cartId}`);
    await loadCart();
  }

  /** 로그인하면 로드 */
  useEffect(() => {
    if (user) {
      loadCart();
    }
  }, [user]);

  return (
    <CartContext.Provider value={{ cart, loadCart, addToCart, updateQuantity, changeOption, deleteItem }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}

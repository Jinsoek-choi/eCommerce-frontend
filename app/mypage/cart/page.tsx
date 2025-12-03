"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { Trash2, Plus, Minus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const router = useRouter();
  const { cart, initialLoading, deleteItem, updateQuantity, clearCart } = useCart();

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        장바구니 불러오는 중...
      </div>
    );
  }

  if (!initialLoading && cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 py-10 px-6">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-10 text-center">
          <h1 className="text-2xl font-bold mb-4">장바구니</h1>
          <p className="text-gray-500 text-lg">장바구니가 비어있습니다.</p>
        </div>
      </div>
    );
  }

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="py-10 px-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-gray-900">장바구니</h1>
        <button
          onClick={clearCart}
          className="flex gap-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition cursor-pointer"
        >
          <Trash2 size={20} /> 전체 삭제
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {cart.map((item) => (
          <div
            key={item.cartId}
            className="bg-white rounded-xl shadow hover:shadow-lg transition p-4 flex flex-col"
          >
            <Link href={`/product/${item.productId}`} className="block">
              <img
                src={item.thumbnail || "/images/default_main.png"}
                alt={item.productName}
                className="w-full aspect-[3/4] object-contain rounded-lg mb-3"
              />
            </Link>

            <p className="text-gray-800 text-center text-base font-medium line-clamp-2 min-h-[40px]">
              {item.productName}
            </p>

            <p className="text-gray-900 font-bold text-center mt-1">
              {item.price.toLocaleString()}원
            </p>

            {item.option && (
              <p className="text-gray-500 text-sm text-center mt-1">
                옵션: [{item.option.optionTitle}] {item.option.optionValue}
              </p>
            )}

            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    updateQuantity(item.cartId, Math.max(1, item.quantity - 1))
                  }
                  className="p-1 bg-gray-400 rounded hover:bg-gray-500 transition cursor-pointer"
                >
                  <Minus size={16} />
                </button>

                <span className="w-6 text-center text-gray-800 font-medium">
                  {item.quantity}
                </span>

                <button
                  onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                  className="p-1 bg-gray-400 rounded hover:bg-gray-500 transition cursor-pointer"
                >
                  <Plus size={16} />
                </button>
              </div>

              <button
                onClick={() => deleteItem(item.cartId)}
                className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm cursor-pointer"
              >
                <Trash2 size={14} /> 삭제
              </button>
            </div>

            <p className="text-gray-900 font-bold text-center mt-2">
              {(item.price * item.quantity).toLocaleString()}원
            </p>
          </div>
        ))}
      </div>

      {/* 결제 요약 */}
      <div className="bg-white rounded-xl shadow p-6 mt-8 flex flex-col gap-3 max-w-sm mx-auto">
        <div className="flex justify-between">
          <span>상품 금액</span>
          <span>{totalPrice.toLocaleString()}원</span>
        </div>
        <div className="flex justify-between">
          <span>배송비</span>
          <span className="text-blue-600">무료</span>
        </div>
        <div className="flex justify-between pt-3 border-t font-bold text-lg">
          <span>총 결제 금액</span>
          <span className="text-blue-600">{totalPrice.toLocaleString()}원</span>
        </div>

        <button
          onClick={() => router.push("/order/checkout")}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold transition cursor-pointer mt-4"
        >
          {totalPrice.toLocaleString()}원 결제하기
        </button>
      </div>
    </div>
  );
}

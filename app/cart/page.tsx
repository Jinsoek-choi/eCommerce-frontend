"use client";
import { useCart } from "../../context/CartContext";

export default function CartPage() {
  const { cart, removeFromCart } = useCart();

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">장바구니</h1>

        {cart.length === 0 ? (
          <p className="text-gray-600 text-lg">장바구니가 비어있습니다.</p>
        ) : (
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow p-5 flex justify-between items-center hover:shadow-lg transition"
              >
                <div>
                  <div className="text-lg font-semibold text-gray-800">{item.name}</div>
                  <div className="text-gray-600 text-sm mt-1">
                    {item.price.toLocaleString()}원
                  </div>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="bg-red-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-red-600 transition"
                >
                  삭제
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

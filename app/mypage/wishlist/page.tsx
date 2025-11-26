"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";
import { useWishlist } from "../../../context/WishlistContext";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist();

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">찜한 상품</h1>

        {wishlist.length === 0 ? (
          <p className="text-gray-500 text-center py-10 text-lg">
            찜한 상품이 없습니다.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {wishlist.map((item) => (
              <div
                key={item.productId}
                className="bg-white rounded-xl shadow p-4 flex flex-col items-center gap-2"
              >
                <Link href={`/product/${item.productId}`}>
                  <img
                    src={item.mainImg || "/images/default_main.png"}
                    alt={item.productName}
                    className="w-full h-40 object-contain rounded-lg"
                  />
                </Link>

                <p className="text-gray-800 font-medium text-center">
                  {item.productName}
                </p>
                <p className="text-black font-bold">
                  {item.sellPrice.toLocaleString()}원
                </p>

                <button
                  onClick={() => removeFromWishlist(item.productId)}
                  className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm mt-2"
                >
                  <Trash2 size={14} /> 삭제
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

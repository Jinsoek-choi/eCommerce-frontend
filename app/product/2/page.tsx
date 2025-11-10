"use client";
import { useParams } from "next/navigation";
import { products } from "../../lib/products";
import { addToCart } from "../../lib/cart";

export default function ProductDetail() {
  const { id } = useParams();
  const product = products.find((p) => p.id == Number(id));

  if (!product)
    return (
      <p className="text-center mt-20 text-xl text-gray-600 font-medium">
        상품을 찾을 수 없습니다.
      </p>
    );

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-6 items-start">
        {/* 상품 이미지 */}
        <div className="w-full md:w-1/2 bg-white rounded-xl shadow-lg p-5 flex justify-center">
          <img
            src={product.img}
            alt={product.name}
            className="rounded-xl object-cover max-h-80"
          />
        </div>

        {/* 상품 정보 */}
        <div className="w-full md:w-1/2 bg-white rounded-xl shadow-lg p-5 flex flex-col justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{product.name}</h1>
            <p className="mt-2 text-gray-700 font-semibold text-lg">
              {product.price.toLocaleString()}원
            </p>
          </div>

          <button
            onClick={() => addToCart(product)}
            className="mt-6 w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-xl shadow hover:bg-blue-500 transition"
          >
            장바구니 담기
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * 카테고리별 상품 목록 페이지
 *
 * 기능:
 * - URL에서 leafCode 추출
 * - leafCode에 따라 상품 목록 조회 (useCategoryProducts 훅)
 * - 로딩 상태/빈 목록 상태/상품 리스트 표시
 * - 상품 클릭 시 상품 상세 페이지로 이동
 */

"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useCategoryProducts } from "@/hooks/useCategoryProducts";
import { toFullUrl } from "@/lib/utils/toFullUrl";

export default function CategoryPage({ params }: { params: Promise<{ leafCode: string }> }) {
  const { leafCode } = use(params);
  const router = useRouter();

  const { products, loading } = useCategoryProducts(leafCode);

  const truncate = (text: string, max = 15) =>
    text.length > max ? text.slice(0, max) + "..." : text;

  return (
    <div className="w-full max-w-6xl mx-auto my-12 px-4">

      {/* 제목 */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          카테고리: {leafCode}
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          총 {products.length}개 상품
        </p>
      </div>

      {/* 로딩 */}
      {loading ? (
        <div className="w-full flex flex-col items-center justify-center py-10">
          <p className="text-gray-700 mb-3">상품 불러오는 중...</p>
          <img
            src="/images/signature_w.png"
            alt="Loading"
            className="inline-block w-8 h-8 md:w-20 md:h-20 animate-spin-slow"
          />
        </div>
      ) : products.length === 0 ? (

        /* 상품 없음 */
        <div className="w-full flex flex-col items-center justify-center py-20">
          <p className="text-gray-500">해당 카테고리에 상품이 없습니다.</p>
        </div>

      ) : (

        /* 메인페이지와 동일한 상품 카드 UI 적용*/
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {products.map((p, index) => (
            <div
              key={`${p.productId}-${index}`}
              className="text-center bg-white rounded-2xl shadow hover:shadow-xl transition flex flex-col cursor-pointer overflow-hidden"
              onClick={() => router.push(`/product/${p.productId}`)}
            >
              {/* 상품 이미지 */}
              <div className="w-full rounded-xl overflow-hidden flex items-center justify-center bg-white">
                <img
                  src={toFullUrl(p.mainImg || "/images/default_main.png")}
                  alt={p.productName}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* 상품명 */}
              <p className="text-gray-800 text-center text-base font-medium mt-3 mb-1 line-clamp-2 min-h-[40px]">
                {truncate(p.productName)}
              </p>

              {/* 소비자가 + 할인 */}
              <p
                className={`text-gray-500 text-sm line-through ${
                  p.consumerPrice && p.consumerPrice <= p.sellPrice ? "invisible" : ""
                }`}
              >
                {p.consumerPrice?.toLocaleString()}원
              </p>

              {/* 판매가 + 할인율 */}
              <p className="text-black font-bold mt-1 text-lg">
                {p.consumerPrice && p.consumerPrice > p.sellPrice && (
                  <span className="text-red-500 px-2 font-bold">
                    {Math.round(
                      ((p.consumerPrice - p.sellPrice) / p.consumerPrice) * 100
                    )}
                    %
                  </span>
                )}
                {p.sellPrice.toLocaleString()}원
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

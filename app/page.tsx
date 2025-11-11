"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Product {
  productId: number;
  productName: string;
  consumerPrice: number;
  sellPrice: number;
  thumbnailUrl: string;
}

const banners = [
  "/images/banner1.jpg",
  "/images/banner2.jpg",
  "/images/banner3.jpg",
];

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    fetch("http://localhost:8080/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("상품 데이터를 불러오지 못했습니다:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 3000)
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        상품 불러오는 중...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4">
      {/* 배너 슬라이더 */}
      <div className="w-full relative">
        <div className="w-full pt-50 relative overflow-hidden">
          {banners.map((banner, index) => (
            <img
              key={index}
              src={banner}
              alt={`배너 ${index + 1}`}
              className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-700 ${
                index === currentBanner ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            />
          ))}
        </div>

        {/* 선택적: 아래 점 표시 */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {banners.map((_, index) => (
            <span
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentBanner ? "bg-blue-600" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>

      {/* 상품 목록 */}
      <div className="max-w-4xl mx-auto mt-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">상품 목록</h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {/* {products.map((p) => (
            <Link
              key={p.productId}
              href={`/product/${p.productId}`}
              className="bg-white rounded-xl shadow hover:shadow-lg transition p-5 flex flex-col items-center"
            >
              <img
                src={`/images/${p.thumbnailUrl}`}
                alt={p.productName}
                className="w-32 h-32 object-cover rounded-md mb-3"
              />

              <div className="text-lg font-semibold text-gray-800 text-center">
                {p.productName}
              </div>

              <div className="text-gray-500 text-sm line-through mt-1">
                {p.consumerPrice.toLocaleString()}원
              </div>

              <div className="text-gray-800 font-bold mt-1">
                {p.sellPrice.toLocaleString()}원
              </div>
            </Link>
          ))} */}
        </div>
      </div>
    </div >
  );
}

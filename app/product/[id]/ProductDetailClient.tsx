"use client";

import ProductDetailTop from "@/components/product/ProductDetailTop";
import ProductDetailBottom from "@/components/product/ProductDetailBottom";

export default function ProductDetailClient({ product }: any) {
  return (
    <div className="w-full">
      <ProductDetailTop product={product} />
      <ProductDetailBottom product={product} />
    </div>
  );
}

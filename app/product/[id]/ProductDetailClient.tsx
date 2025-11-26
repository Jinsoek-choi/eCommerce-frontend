"use client";

import ProductDetailTop from "@/app/product/components/ProductDetailTop";
import ProductDetailBottom from "@/app/product/components/ProductDetailBottom";

export default function ProductDetailClient({ product }: any) {
  return (
    <div className="w-full">
      <ProductDetailTop product={product} />
      <ProductDetailBottom product={product} />
    </div>
  );
}

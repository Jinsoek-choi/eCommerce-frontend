"use client";
import ProductImages from "./ProductImages";
import ProductInfo, { Product } from "./ProductInfo";

interface ProductDetailTopProps {
  product: Product;
}

export default function ProductDetailTop({ product }: ProductDetailTopProps) {
  if (!product.mainImg) return null;

  return (
    <div className="max-w-6xl mx-auto my-10 bg-white p-8 rounded-xl shadow flex flex-col">
      <div className="grid md:grid-cols-2 gap-10 items-start">
        <ProductImages mainImg={product.mainImg} subImages={product.subImages} />
        <ProductInfo product={product} />
      </div>
    </div>
  );
}

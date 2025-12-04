"use client";

import { useMemo } from "react";
import { SelectedOption, Product } from "@/types/product";

/**
 * 옵션 총 금액 계산 훅
 * 
 * - 옵션 상품이면: (옵션가격 × 수량) 합산
 * - 단일 상품이면: product.sellPrice 반환
 */
export function useOptionTotalPrice(product: Product, selectedOptions: SelectedOption[]) {
  
  const finalPrice = useMemo(() => {
    // 옵션 없는 단일 상품
    if (!product.isOption) {
      return product.sellPrice;
    }

    // 2) 옵션 상품이지만 아직 선택 안한 경우 → 기본 판매가 표시
    if (selectedOptions.length === 0) {
      return product.sellPrice;
    }  


    // 옵션 상품 총합 계산
    return selectedOptions.reduce((sum, opt) => {
      return sum + opt.sellPrice * opt.count;
    }, 0);
  }, [product, selectedOptions]);

  return finalPrice;
}

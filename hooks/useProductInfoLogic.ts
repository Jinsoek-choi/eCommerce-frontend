"use client";

import { useState, useEffect, useRef } from "react";
import { toggleLike } from "@/lib/api/product";
import { SelectedOption, Option, Product } from "@/types/product";
import type { User } from "@/context/UserContext";
import axios from "axios";

/**
 * 상품 상세에서 필요한 모든 비즈니스 로직을 담당하는 커스텀 훅
 *
 * 포함 기능:
 *  - 좋아요(Like) 토글
 *  - 옵션 선택/제거/수량 변경
 *  - 장바구니 담기
 *  - 구매하기(바로 구매)
 *  - 옵션 드롭다운 외부 클릭 감지
 *
 * UI는 ProductInfo.tsx에서 담당하고,
 * 모든 로직은 이 훅에서 책임져서 컴포넌트를 깔끔하게 유지한다.
 */

export function useProductInfoLogic(
  product: Product,     // 상품 정보
  user: User | null,    // 현재 로그인한 사용자
  addToCart: any,       // CartContext에서 제공된 장바구니 추가 함수
  router: any           // next/navigation router
) {

  /** ----------------------------------------
   * 옵션 관련 상태
   * ---------------------------------------- */
  // 선택된 옵션 리스트
  const [selectedOptions, setSelectedOptions] = useState<SelectedOption[]>([]);

  // 옵션 드롭다운 DOM reference
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 드롭다운 ON/OFF 상태
  const [dropdownOpen, setDropdownOpen] = useState(false);

  /** ----------------------------------------
   * 좋아요 관련 상태
   * ---------------------------------------- */
  // 좋아요 여부 (초기값은 product.userLiked)
  const [isLiked, setIsLiked] = useState(!!product.userLiked);

  // 좋아요 숫자
  const [likesCount, setLikesCount] = useState(product.likeCount || 0);

  // 좋아요 요청 중인지 (중복 클릭 방지)
  const [likeLoading, setLikeLoading] = useState(false);

  /**
   * 좋아요 토글 함수
   * - 로그인 안되어 있으면 로그인 페이지로 이동
   * - toggleLike API 호출
   * - 성공 시 liked/likesCount 갱신
   */
  const handleLike = async () => {
    if (!user) return router.push("/login");  // 비로그인 → 로그인 유도
    if (likeLoading) return;                  // 중복 클릭 방지

    setLikeLoading(true);
    try {
      const data = await toggleLike(product.productId);
      setIsLiked(data.liked);
      setLikesCount(data.likes);
    } finally {
      setLikeLoading(false);
    }
  };

  /**
   * 옵션 선택
   * - 이미 선택한 옵션이면 추가되지 않도록 체크
   * - count 기본값: 1
   */
  const handleSelectOption = (opt: Option) => {
    // 이미 선택된 옵션인지 체크
    if (selectedOptions.some((o) => o.optionId === opt.optionId)) return;

    // 선택 옵션 리스트에 추가
    setSelectedOptions((prev) => [...prev, { ...opt, count: 1 }]);

    // 선택 후 드롭다운 닫기
    setDropdownOpen(false);
  };

  /**
   * 장바구니 담기
   * - 비로그인 → 로그인 페이지 이동
   * - 옵션이 있는 상품인데 옵션 미선택 → 경고
   * - 옵션이 여러 개 선택된 경우 반복해서 addToCart 호출
   */
  const handleAddToCart = async () => {
    if (!user) return router.push("/login");

    // 옵션 상품인데 옵션 선택 안했을 경우
    if (product.isOption && selectedOptions.length === 0) {
      return alert("옵션을 선택해주세요!");
    }

    try {
      if (product.isOption) {
        // ✅ 옵션 상품: optionValue에는 "문자열 옵션명"을 보낸다
        for (const opt of selectedOptions) {
          await addToCart(
            product.productId,
            opt.value,      // 🔥 여기! opt.optionId 말고 opt.value
            opt.count
          );
        }
      } else {
        // ✅ 단일 상품: optionValue = null
        await addToCart(product.productId, null, 1);
      }

      if (
        window.confirm(
          "장바구니에 담았습니다.\n장바구니 페이지로 이동할까요?"
        )
      ) {
        router.push("/mypage/cart");
      }
    } catch (err) {
      console.error("장바구니 추가 실패:", err);
      alert("장바구니 추가 실패");
    }
  };

  /**
   * 구매하기
   * - 옵션 선택 여부 체크
   * - 구매 페이지에서 사용할 데이터를 sessionStorage에 저장
   * - /order/checkout 페이지로 이동
   */
  const handleBuyNow = () => {
    if (!user) return router.push("/login");
    if (product.isOption && selectedOptions.length === 0)
      return alert("옵션을 선택해주세요!");

    const orderInfo = {
      productId: product.productId,
      productName: product.productName,
      mainImg: product.mainImg,
      sellPrice: product.sellPrice,
      options: selectedOptions,
    };

    // 결제 페이지로 전달할 데이터 임시 저장
    sessionStorage.setItem("checkoutData", JSON.stringify(orderInfo));
    router.push("/order/checkout");
  };

  /**
   * 옵션 드롭다운 외부 클릭 시 자동으로 닫히도록 처리
   */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return {
    // 옵션 관련
    selectedOptions,
    setSelectedOptions,
    dropdownOpen,
    setDropdownOpen,
    dropdownRef,
    handleSelectOption,

    // 좋아요 관련
    isLiked,
    likesCount,
    likeLoading,
    handleLike,

    // 장바구니/구매
    handleAddToCart,
    handleBuyNow,
  };
}

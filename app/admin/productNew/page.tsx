"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "../../ui/Input";
import Textarea from "../../ui/Textarea";
import Button from "../../ui/Button";
import ImageUpload from "../../ui/ImageUpload";

// 상품 옵션을 위한 인터페이스 정의
interface ProductOption {
  optionTitle: string;  // 옵션 제목 (예: 색상, 사이즈)
  optionValue: string;  // 옵션 값 (예: Red, Blue, S, M, L)
  sellPrice: number;    // 옵션 가격
  stock: number;        // 옵션 재고
  isShow: boolean;      // 옵션 노출 여부
}

interface Product {
  productName: string;
  description?: string;
  mainImg?: string;
  consumerPrice?: number;
  sellPrice: number;
  stock: number;
  productStatus: number;
  isShow: boolean;
  isOption: boolean;   // 옵션 여부
  selectedOption: string | null;  // 색상 또는 사이즈 옵션
  options: ProductOption[];  // 상품 옵션
}

export default function ProductNewPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;  // 백엔드 API URL
  const router = useRouter();  // 페이지 이동을 위한 라우터

  // 상품 정보를 관리할 상태 정의
  const [product, setProduct] = useState<Product>({
    productName: "",
    description: "",
    mainImg: "",
    consumerPrice: 0,
    sellPrice: 0,
    stock: 0,
    productStatus: 0,  // 기본값: 0 (판매 중)
    isShow: true,      // 기본값: 1 (웹사이트에 노출)
    isOption: false,   // 기본값: 단일 상품
    selectedOption: null,  // 색상 또는 사이즈 옵션 선택
    options: [],       // 옵션 배열 (옵션 상품인 경우에만 사용)
  });

  // 입력값 변경 시 상태 업데이트 함수
  const handleChange = (field: keyof Product, value: any) => {
    setProduct({ ...product, [field]: value });
  };

  // 옵션 정보 변경 함수
  const handleOptionChange = (index: number, field: keyof ProductOption, value: any) => {
    const updatedOptions = [...product.options];
    updatedOptions[index] = {
      ...updatedOptions[index],
      [field]: value,
    };
    setProduct({ ...product, options: updatedOptions });
  };

  // 이미지 URL 업데이트 함수 (이미지 업로드 후 호출)
  const handleImageChange = (imageUrl: string) => {
    setProduct({ ...product, mainImg: imageUrl });
  };

  // 상품 등록 함수
  const handleSave = async () => {
    // 필수값 검증: 상품명, 판매가, 재고는 반드시 입력되어야 함
    if (!product.productName || !product.sellPrice || !product.stock) {
      alert("필수 항목이 비어있습니다.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/admin/products`, {
        method: "POST",  // 상품 등록
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });

      if (!res.ok) throw new Error("저장 실패");

      alert("상품이 등록되었습니다.");
      router.push("/admin/productList");
    } catch (err) {
      console.error(err);
      alert("상품 등록 중 오류가 발생했습니다.");
    }
  };

  // 최종 가격 계산
  const calculateFinalPrice = () => {
    let finalPrice = product.sellPrice;
    // 옵션이 선택된 경우, 해당 옵션 가격을 추가
    if (product.selectedOption && product.options.length > 0) {
      const selectedOption = product.options.find(
        (option) => option.optionValue === product.selectedOption
      );
      if (selectedOption) {
        finalPrice += selectedOption.sellPrice;  // 옵션 가격 추가
      }
    }
    return finalPrice;
  };

  return (
    <div className="py-10 px-4">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-10">
        <h1 className="text-4xl font-extrabold mb-10 text-gray-800 pb-4 border-b border-gray-200">
          상품 등록
        </h1>

        <div className="grid md:grid-cols-2 gap-10 mt-6">
          {/* 왼쪽: 이미지 업로드 */}
          <ImageUpload image={product.mainImg} onChange={handleImageChange} />

          {/* 오른쪽: 상품 정보 입력 */}
          <div className="flex flex-col gap-6">
            <Input
              label="상품명"
              value={product.productName}
              onChange={(e) => handleChange("productName", e.target.value)}
              placeholder="상품명을 입력하세요"
            />
            <Textarea
              label="상품 설명"
              value={product.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="상품 설명을 입력하세요"
              rows={6}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input
                label="소비자가"
                type="number"
                value={product.consumerPrice || 0}
                onChange={(e) => handleChange("consumerPrice", Number(e.target.value))}
              />
              <Input
                label="판매가"
                type="number"
                value={product.sellPrice}
                onChange={(e) => handleChange("sellPrice", Number(e.target.value))}
              />
              <Input
                label="재고"
                type="number"
                value={product.stock}
                onChange={(e) => handleChange("stock", Number(e.target.value))}
              />
            </div>

            {/* 옵션 상품 여부 선택 */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">옵션 상품 선택</h2>
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  checked={product.isOption}
                  onChange={(e) => handleChange("isOption", e.target.checked)}
                />
                <span className="ml-2">옵션 상품 여부</span>
              </div>

              {/* 옵션에 따라 색상 또는 사이즈 선택 */}
              {product.isOption && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">옵션 선택</h3>
                  <div className="mb-4">
                    <label className="text-sm font-medium text-gray-700">색상 옵션</label>
                    <div>
                      {product.options
                        .filter((option) => option.optionTitle === "색상")
                        .map((option, index) => (
                          <div key={index}>
                            <input
                              type="radio"
                              id={option.optionValue}
                              name="colorOption"
                              value={option.optionValue}
                              checked={product.selectedOption === option.optionValue}
                              onChange={(e) => handleChange("selectedOption", e.target.value)}
                            />
                            <label className="ml-2">{option.optionValue} (+{option.sellPrice}원)</label>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">사이즈 옵션</label>
                    <div>
                      {product.options
                        .filter((option) => option.optionTitle === "사이즈")
                        .map((option, index) => (
                          <div key={index}>
                            <input
                              type="radio"
                              id={option.optionValue}
                              name="sizeOption"
                              value={option.optionValue}
                              checked={product.selectedOption === option.optionValue}
                              onChange={(e) => handleChange("selectedOption", e.target.value)}
                            />
                            <label className="ml-2">{option.optionValue} (+{option.sellPrice}원)</label>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 최종 가격 계산 후 표시 */}
            <div className="mt-4">
              <span className="text-xl font-semibold">최종 가격: {calculateFinalPrice()}원</span>
            </div>

            {/* 저장 버튼 */}
            <Button className="w-full mt-4 md:mt-6 col-span-2" onClick={handleSave}>
              상품 등록
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Input from "../../ui/Input";
import Textarea from "../../ui/Textarea";
import Button from "../../ui/Button";
import ImageUpload from "../../ui/ImageUpload";
import Link from "next/link"; 

// 상품 옵션을 위한 인터페이스 정의
interface ProductOption {
  optionId: number;
  optionTitle: string;
  optionValue: string;
  sellPrice: number;
  stock: number;
  isShow: boolean;
}

interface Product {
  productId: number;
  productName: string;
  description?: string;
  mainImg?: string;
  consumerPrice: number;
  sellPrice: number;
  stock: number;
  productStatus: number;
  isShow: boolean;  // 상품 노출 여부
  isOption: boolean;  // 옵션 상품 여부
  selectedOption: string | null;  // 선택된 옵션 (색상 또는 사이즈)
  options?: ProductOption[];  // 옵션 목록
}

export default function ProductEditPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  // 상품 정보 불러오기
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_URL}/api/admin/products/${id}`);
        if (!res.ok) throw new Error("상품을 불러오는 중 오류 발생");
        const data: Product = await res.json();
        setProduct(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // 상품 정보 업데이트 함수
  const handleChange = (field: keyof Product, value: any) => {
    setProduct((prevProduct: Product | null) => {
      if (!prevProduct) return prevProduct;
      return {
        ...prevProduct,
        [field]: value,
      };
    });
  };

  // 옵션 정보 업데이트 함수
  const handleOptionChange = (optionIndex: number, field: keyof ProductOption, value: any) => {
    setProduct((prevProduct: Product | null) => {
      if (!prevProduct) return prevProduct;

      const currentOptions: ProductOption[] = prevProduct.options ?? [];
      const updatedOptions = [...currentOptions];

      updatedOptions[optionIndex] = {
        ...updatedOptions[optionIndex],
        [field]: value,
      };

      return {
        ...prevProduct,
        options: updatedOptions,
      };
    });
  };

  // 이미지 URL 업데이트
  const handleImageChange = (imageUrl: string) => {
    setProduct((prevProduct: Product | null) => {
      if (!prevProduct) return prevProduct;
      return {
        ...prevProduct,
        mainImg: imageUrl,
      };
    });
  };

  // 상품 정보 저장 함수
  const handleSave = async () => {
    // 필수 값 검증
    if (!product || !product.productName || !product.sellPrice || !product.stock) {
      alert("필수 항목이 비어있습니다.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/admin/products/${product.productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),

      });
      if (!res.ok) throw new Error("저장 실패");

      alert("상품 정보가 저장되었습니다.");
      router.push("/admin/productList");
    } catch (err) {
      console.error(err);
      alert("상품 저장 중 오류가 발생했습니다.");
    }
  };

  // 최종 가격 계산
  const calculateFinalPrice = () => {
    if (!product) return 0; // product가 없을 경우, 가격 0 반환

    let finalPrice = product.sellPrice; // 기본 판매 가격

    // 옵션이 선택된 경우, 해당 옵션 가격을 추가
    if (product.selectedOption && Array.isArray(product.options) && product.options.length > 0) {
      const selectedOption = product.options.find(
        (option) => option.optionValue === product.selectedOption
      );

      if (selectedOption) {
        finalPrice += selectedOption.sellPrice;  // 옵션 가격 추가
      }
    }
    return finalPrice;
  };

  if (loading || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        상품 불러오는 중...
        <img
          src="/images/signature_w.png"
          alt="Loading"
          className="inline-block w-8 h-8 md:w-20 md:h-20 mx-[2px] -mb-2 animate-spin-slow"
        />
      </div>
    );
  }

  return (
    <div className="py-10 px-4">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-10">
        <h1 className="text-4xl font-extrabold mb-10 text-gray-800 pb-4 border-b border-gray-200">
          상품 수정
        </h1>

        <div className="grid md:grid-cols-2 gap-10 mt-6">
          {/* 왼쪽: 이미지 업로드 (mainImg 필드 수정) */}
          <ImageUpload
            image={product.mainImg}
            onChange={handleImageChange}  // 이미지 변경 시 `mainImg` 값 업데이트
          />

          {/* 오른쪽: 상품 정보 */}
          <div className="flex flex-col gap-6">
            <Input
              label="상품명"
              value={product.productName}
              onChange={(e) => handleChange("productName", e.target.value)}  // 상품명 수정
            />
            <Textarea
              label="상품 설명"
              value={product.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}  // 상품 설명 수정
              rows={6}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input
                label="소비자가"
                type="number"
                value={product.consumerPrice || 0}
                onChange={(e) => handleChange("consumerPrice", Number(e.target.value))}  // 소비자가 수정
              />
              <Input
                label="판매가"
                type="number"
                value={product.sellPrice || 0}
                onChange={(e) => handleChange("sellPrice", Number(e.target.value))}  // 판매가 수정
              />
              <Input
                label="재고"
                type="number"
                value={product.stock || 0}
                onChange={(e) => handleChange("stock", Number(e.target.value))}  // 재고 수정
              />
            </div>

            {/* 최종 가격 표시 */}
            <div className="mt-4">
              <label className="block text-sm font-semibold text-gray-700">최종 가격</label>
              <input
                type="text"
                value={calculateFinalPrice().toLocaleString()} // 최종 가격 표시
                readOnly
                className="mt-1 p-2 border rounded-md shadow-sm"
              />
            </div>

            {/* 상품 노출 여부 설정 */}
            <div className="mt-6">
              <label className="block text-sm font-semibold text-gray-700">상품 노출 여부</label>
              <select
                value={product.isShow ? "yes" : "no"}
                onChange={(e) => handleChange("isShow", e.target.value === "yes")}
                className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md"
              >
                <option value="yes">노출</option>
                <option value="no">숨김</option>
              </select>
            </div>

            {/* 옵션 상품일 경우 옵션 목록 보여주기 */}
            {product.isOption && product.options && Array.isArray(product.options) && product.options.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">옵션 상품 수정</h2>
                {product.options.map((option, index) => (
                  <div key={option.optionId} className="flex flex-col gap-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <Input
                        label="옵션명"
                        value={option.optionTitle}
                        onChange={(e) => handleOptionChange(index, "optionTitle", e.target.value)}  // 옵션명 수정
                      />
                      <Input
                        label="옵션값"
                        value={option.optionValue}
                        onChange={(e) => handleOptionChange(index, "optionValue", e.target.value)}  // 옵션값 수정
                      />
                      <Input
                        label="옵션 가격"
                        type="number"
                        value={option.sellPrice || 0}
                        onChange={(e) => handleOptionChange(index, "sellPrice", Number(e.target.value))}  // 옵션 가격 수정
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="재고"
                        type="number"
                        value={option.stock || 0}
                        onChange={(e) => handleOptionChange(index, "stock", Number(e.target.value))}  // 옵션 재고 수정
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}


            <Button className="w-full mt-4 md:mt-6 col-span-2" onClick={handleSave}>
              저장
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

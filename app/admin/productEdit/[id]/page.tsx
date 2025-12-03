"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Input from "../../../ui/Input";
import Button from "../../../ui/Button";
import ImageUpload from "../../../ui/ImageUpload";
import MultiImageUpload from "../../../ui/MultiImageUpload";
import { Plus, Trash2 } from "lucide-react";

interface Option {
  name: string;
  stock: number;
}

interface Product {
  productName: string;
  mainImg?: string;
  subImages?: string[];
  categoryCode?: string;
  options: Option[];
}

interface CategoryTree {
  [bigCode: string]: {
    title: string;
    children: {
      [midCode: string]: {
        title: string;
        children: {
          [leafCode: string]: string;
        };
      };
    };
  };
}

export default function ProductEditPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();
  const params = useParams(); // params.id 사용
  const productId = params?.id;

  const [product, setProduct] = useState<Product>({
    productName: "",
    mainImg: "",
    subImages: [],
    categoryCode: "",
    options: [],
  });

  const [categoryTree, setCategoryTree] = useState<CategoryTree | null>(null);
  const [selectedBig, setSelectedBig] = useState<string>("");
  const [selectedMid, setSelectedMid] = useState<string>("");

  // 카테고리 트리 fetch
  useEffect(() => {
    fetch(`${API_URL}/api/categories/tree`)
      .then((res) => res.json())
      .then((data) => setCategoryTree(data.tree))
      .catch(console.error);
  }, [API_URL]);

  // 기존 상품 정보 fetch
  useEffect(() => {
    if (!productId) return;
    fetch(`${API_URL}/api/products/${productId}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct({
          productName: data.productName || "",
          mainImg: data.mainImg || "",
          subImages: data.subImages || [],
          categoryCode: data.categoryCode || "",
          options: data.options || [],
        });

        // 카테고리 선택 초기화
        if (data.categoryCode && categoryTree) {
          for (const [bigCode, bigNode] of Object.entries(categoryTree)) {
            for (const [midCode, midNode] of Object.entries(bigNode.children)) {
              if (midNode.children[data.categoryCode]) {
                setSelectedBig(bigCode);
                setSelectedMid(midCode);
              }
            }
          }
        }
      })
      .catch(console.error);
  }, [API_URL, productId, categoryTree]);

  const handleChange = (field: keyof Product, value: any) => {
    setProduct((prev) => ({ ...prev, [field]: value }));
  };

  const addOption = () =>
    setProduct((prev) => ({
      ...prev,
      options: [...prev.options, { name: "", stock: 0 }],
    }));

  const updateOption = (idx: number, p0: string, p1: number) =>
    setProduct((prev) => {
      const newOptions = [...prev.options];
      return { ...prev, options: newOptions };
    });

  const removeOption = (index: number) =>
    setProduct((prev) => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
    }));

  const handleSave = async () => {
    if (!product.categoryCode) return alert("카테고리를 선택해주세요.");
    try {
      const res = await fetch(`${API_URL}/api/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
      if (!res.ok) throw new Error("수정 실패");

      alert("상품이 수정되었습니다.");
      router.push("/admin/productList");
    } catch (err) {
      console.error(err);
      alert("상품 수정 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="py-10 px-4 min-h-screen">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-10">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-8 text-gray-800 pb-2 border-b border-gray-200">
          상품 수정
        </h1>

        <div className="flex flex-col md:flex-row gap-8 mt-6">
          {/* 좌측: 이미지 업로드 */}
          <div className="flex flex-col gap-6 md:w-1/2">
            <p className="font-semibold">대표 이미지</p>
            <ImageUpload
              image={product.mainImg}
              onChange={(val: any) => handleChange("mainImg", val)}
            />

            <p className="font-semibold mt-4">상세 이미지</p>
            <MultiImageUpload
              images={product.subImages || []}
              onChange={(imgs: any) => handleChange("subImages", imgs)}
            />
          </div>

          {/* 우측: 상품 정보 */}
          <div className="flex flex-col gap-6 md:w-1/2">
            <Input
              label="상품명"
              value={product.productName}
              onChange={(e: { target: { value: any; }; }) => handleChange("productName", e.target.value)}
              placeholder="상품명을 입력하세요"
            />

            {/* 카테고리 선택 */}
            {categoryTree ? (
              <div className="flex flex-col gap-2">
                <p className="font-semibold">카테고리 선택</p>
                {/* 대분류 */}
                <div className="flex flex-wrap gap-2">
                  {Object.entries(categoryTree).map(([bigCode, bigNode]) => (
                    <button
                      key={bigCode}
                      className={`px-3 py-1 rounded-full border text-sm transition cursor-pointer ${
                        selectedBig === bigCode
                          ? "bg-black text-white border-black"
                          : "bg-gray-100 border-gray-200 hover:bg-gray-200"
                      }`}
                      onClick={() => {
                        setSelectedBig(bigCode);
                        setSelectedMid("");
                        handleChange("categoryCode", "");
                      }}
                    >
                      {bigNode.title}
                    </button>
                  ))}
                </div>
                {/* 중분류 */}
                {selectedBig && (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {Object.entries(categoryTree[selectedBig].children).map(
                      ([midCode, midNode]) => (
                        <button
                          key={midCode}
                          className={`px-3 py-1 rounded-full border text-sm transition cursor-pointer ${
                            selectedMid === midCode
                              ? "bg-black text-white border-black"
                              : "bg-gray-100 border-gray-200 hover:bg-gray-200"
                          }`}
                          onClick={() => {
                            setSelectedMid(midCode);
                            handleChange("categoryCode", "");
                          }}
                        >
                          {midNode.title}
                        </button>
                      )
                    )}
                  </div>
                )}
                {/* 소분류 */}
                {selectedBig && selectedMid && (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {Object.entries(
                      categoryTree[selectedBig].children[selectedMid].children
                    ).map(([leafCode, leafName]) => (
                      <button
                        key={leafCode}
                        className={`px-3 py-1 rounded-full border text-sm transition cursor-pointer ${
                          product.categoryCode === leafCode
                            ? "bg-black text-white border-black"
                            : "bg-gray-100 border-gray-200 hover:bg-gray-200"
                        }`}
                        onClick={() => handleChange("categoryCode", leafCode)}
                      >
                        {leafName}
                      </button>
                    ))}
                  </div>
                )}

                {product.categoryCode && (
                  <p className="text-sm text-gray-500 mt-1">
                    선택된 카테고리: {product.categoryCode}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-gray-500">카테고리 로드 중...</p>
            )}

            {/* 옵션 */}
            <div className="flex flex-col gap-3 mt-4">
              <div className="flex justify-between items-center">
                <p className="font-semibold text-gray-700">옵션 추가</p>
                <button
                  type="button"
                  onClick={addOption}
                  className="w-6 h-6 flex mx-2 items-center justify-center bg-black text-white rounded-full cursor-pointer"
                >
                  <Plus size={14} />
                </button>
              </div>

              {product.options.map((opt, idx) => (
                <div
                  key={idx}
                  className="flex flex-col md:flex-row gap-2 items-end bg-gray-50 p-3 rounded-lg border border-gray-200"
                >
                  <Input
                    label="옵션명"
                    value={opt.name}
                    onChange={(e: { target: { value: any; }; }) => updateOption(idx, "name", e.target.value)}
                    placeholder="옵션명"
                  />
                  <Input
                    label="재고"
                    type="number"
                    value={opt.stock}
                    onChange={(e: { target: { value: any; }; }) =>
                      updateOption(idx, "stock", Number(e.target.value))
                    }
                  />
                  <button
                    type="button"
                    onClick={() => removeOption(idx)}
                    className="p-2 text-red-500 hover:text-red-700 cursor-pointer"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>

            {/* 저장 버튼 */}
            <Button
              className="w-full mt-6 py-3 text-lg"
              onClick={handleSave}
            >
              상품 수정
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

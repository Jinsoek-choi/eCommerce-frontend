"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Input from "../../ui/Input";
import Button from "../../ui/Button";
import { Plus, Trash2, Image } from "lucide-react";

import type { AdminProduct, AdminProductOption } from "@/types/adminProduct";
import type { CategoryTree } from "@/types/category";
import ProductStatusDropdown from "../dropdown/ProductStatusDropdown";
import IsShowDropdown from "../dropdown/IsShowDropdown";
import OptionDropdown from "../dropdown/OptionDropdown";

export default function ProductNewPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_BASE_URL;
  const router = useRouter();

  const [product, setProduct] = useState<AdminProduct>({
    productId: 0,
    productName: "",
    description: "",
    consumerPrice: 0,
    sellPrice: 0,
    stock: 0,
    isOption: false,
    mainImg: "",
    subImages: [],
    productStatus: 10,
    isShow: true,
    categoryCode: "",
    options: [],
  });

  const [subImageUrl, setSubImageUrl] = useState("");
  const [loadingDescription, setLoadingDescription] = useState(false);

  const totalStock = product.isOption
    ? product.options.reduce((total, opt) => total + opt.stock, 0)
    : product.stock;

  const [categoryTree, setCategoryTree] = useState<CategoryTree | null>(null);
  const [selectedBig, setSelectedBig] = useState("");
  const [selectedMid, setSelectedMid] = useState("");

  const handleChange = (field: keyof AdminProduct, value: any) => {
    setProduct((prev) => ({ ...prev, [field]: value }));
  };

  // ------------------ 옵션 ------------------
  const addOption = () => {
    const newOption: AdminProductOption = {
      optionType: "N",
      optionTitle: "",
      optionValue: "",
      extraPrice: 0,
      stock: 0,
      isShow: true,
      colorCode: "",
    };
    setProduct((prev) => ({ ...prev, options: [...prev.options, newOption] }));
  };

  const updateOption = (
    index: number,
    field: keyof AdminProductOption,
    value: any
  ) => {
    setProduct((prev) => {
      const newOptions = [...prev.options];
      newOptions[index] = { ...newOptions[index], [field]: value };
      return { ...prev, options: newOptions };
    });
  };

  const removeOption = (idx: number) => {
    setProduct((prev) => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== idx),
    }));
  };

  // ------------------ 이미지 ------------------
  const handleAddSubImage = () => {
    if (!subImageUrl) return;
    setSubImageUrl("");
  };

  const removeSubImage = (idx: number) => {
    setProduct((prev) => ({
      ...prev,
      subImages: prev.subImages?.filter((_, i) => i !== idx) ?? [],
    }));
  };

  // ------------------ 카테고리 ------------------
  useEffect(() => {
    if (!API_URL) return;
    fetch(`${API_URL}/api/categories/tree`)
      .then((res) => res.json())
      .then((data) => setCategoryTree(data.tree))
      .catch(console.error);
  }, [API_URL]);

  // ------------------ 저장 ------------------
  const handleSave = async () => {
    if (!product.productName) return alert("상품명을 입력해주세요.");
    if (!product.categoryCode) return alert("카테고리를 선택해주세요.");
    if (!product.sellPrice) return alert("판매가를 입력해주세요.");

    const payload: AdminProduct = {
      ...product,
      options: product.isOption
        ? product.options.map((opt) => ({
          ...opt,
          sellPrice: product.sellPrice + (opt.extraPrice ?? 0),
        }))
        : [],
      stock: product.isOption ? 0 : product.stock,
      subImages: product.subImages || [],
    };

    try {
      const res = await fetch(`${API_URL}/api/admin/products/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("저장 실패");
      alert("상품이 등록되었습니다.");
      router.push("/admin/productList");
    } catch (err) {
      console.error(err);
      alert("상품 등록 중 오류 발생");
    }
  };

  // ------------------ AI 설명 ------------------
  const generateAiDescription = async () => {
    setLoadingDescription(true);
    try {
      const res = await fetch("/api/generate-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: product.productName,
          category: product.categoryCode,
          price: product.sellPrice,
          description: product.description,
          stock: totalStock,
          optionCount: product.options.length,
          mainImage: product.mainImg,
        }),
      });
      const data = await res.json();
      if (data.description)
        setProduct((prev) => ({ ...prev, description: data.description }));
    } catch (err) {
      console.error("AI 생성 오류", err);
    } finally {
      setLoadingDescription(false);
    }
  };

  return (
    <div className="py-10 px-4 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-10 space-y-6">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 pb-2 border-b border-gray-200">
          상품 등록
        </h1>

        {/* 전체 2열 레이아웃 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* 좌측: 이미지, 기본정보 */}
          <div className="space-y-6">
            {/* 대표 / 상세 이미지 */}
            <div className="space-y-4">
              <Input
                label="대표 이미지"
                value={product.mainImg}
                onChange={(e) => handleChange("mainImg", e.target.value)}
                placeholder="대표 이미지 URL"
              />
              {product.mainImg && (
                <img
                  src={`${IMAGE_BASE_URL}${product.mainImg}`}
                  className="w-40 h-40 mt-2 object-cover rounded-lg"
                />
              )}
              <Input
                label="상세 이미지"
                value={subImageUrl}
                onChange={(e) => setSubImageUrl(e.target.value)}
                placeholder="상세 이미지 URL"
              />
              <Button
                className="mt-2 flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900"
                onClick={handleAddSubImage}
              >
                <Image className="w-5 h-5" />
                <span>이미지 추가</span>
              </Button>

              {(product.subImages ?? []).length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {(product.subImages ?? []).map((img, idx) => (
                    <div key={idx} className="relative w-24 h-24">
                      <img
                        src={`${IMAGE_BASE_URL}${img.imageUrl}`}
                        className="w-full h-full object-cover rounded border"
                      />
                      <button
                        onClick={() => removeSubImage(idx)}
                        className="absolute top-0 right-0 text-red-500 bg-white rounded-full p-0.5"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 기본정보 */}
            <div className="space-y-4">
              <Input
                label="상품명"
                value={product.productName}
                onChange={(e) => handleChange("productName", e.target.value)}
              />
              <Input
                label="소비자가"
                type="text"
                value={product.consumerPrice?.toLocaleString()}
                onChange={(e) => {
                  const numericValue = Number(e.target.value.replace(/,/g, ""));
                  handleChange("consumerPrice", numericValue);
                }}
              />
              <Input
                label="기본 판매가"
                type="text"
                value={product.sellPrice?.toLocaleString()}
                onChange={(e) => {
                  const numericValue = Number(e.target.value.replace(/,/g, ""));
                  handleChange("sellPrice", numericValue);
                }}
              />
              {!product.isOption && (
                <Input
                  label="재고(단품)"
                  type="number"
                  value={product.stock}
                  onChange={(e) => handleChange("stock", Number(e.target.value))}
                />
              )}
              <div className="font-semibold">총 재고: {totalStock.toLocaleString()}</div>
            </div>
          </div>

          {/* 우측: 카테고리, 옵션, 설명 */}
          <div className="space-y-6">
            {/* 카테고리 */}
            <div className="space-y-2">
              <p className="font-semibold">카테고리 선택</p>
              {categoryTree ? (
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(categoryTree).map(([big, node]) => (
                      <button
                        key={big}
                        className={`px-3 py-1 rounded-full text-sm border cursor-pointer ${selectedBig === big
                          ? "bg-black text-white border-black"
                          : "bg-gray-100 border-gray-300"
                          }`}
                        onClick={() => {
                          setSelectedBig(big);
                          setSelectedMid("");
                          handleChange("categoryCode", "");
                        }}
                      >
                        {node.title}
                      </button>
                    ))}
                  </div>

                  {selectedBig && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {Object.entries(categoryTree[selectedBig].children).map(([mid, node]) => (
                        <button
                          key={mid}
                          className={`px-3 py-1 rounded-full text-sm border cursor-pointer ${selectedMid === mid
                            ? "bg-black text-white border-black"
                            : "bg-gray-100 border-gray-300"
                            }`}
                          onClick={() => {
                            setSelectedMid(mid);
                            handleChange("categoryCode", "");
                          }}
                        >
                          {node.title}
                        </button>
                      ))}
                    </div>
                  )}

                  {selectedBig && selectedMid && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {Object.entries(categoryTree[selectedBig].children[selectedMid].children).map(
                        ([leaf, name]) => (
                          <button
                            key={leaf}
                            className={`px-3 py-1 rounded-full text-sm border cursor-pointer ${product.categoryCode === leaf
                              ? "bg-black text-white border-black"
                              : "bg-gray-100 border-gray-300"
                              }`}
                            onClick={() => handleChange("categoryCode", leaf)}
                          >
                            {name}
                          </button>
                        )
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <p>카테고리 불러오는 중...</p>
              )}
            </div>

            {/* 상품 설명 */}
            <div className="mb-2">
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-semibold">상품 설명</label>
                <button
                  type="button"
                  onClick={generateAiDescription}
                  disabled={loadingDescription}
                  className="px-3 py-1 text-xs bg-black text-white rounded hover:bg-gray-800 cursor-pointer"
                >
                  {loadingDescription ? "생성중..." : "AI 자동 작성"}
                </button>
              </div>
              <textarea
                className="w-full border rounded-md px-3 py-2 text-sm min-h-[160px]"
                value={product.description || ""}
                onChange={(e) => handleChange("description", e.target.value)}
              />
            </div>

            {/* 옵션 여부 / 총 재고 */}
            <div className="flex justify-between items-center">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={product.isOption}
                  onChange={(e) => handleChange("isOption", e.target.checked)}
                />
                <span className="text-sm cursor-pointer">옵션 상품 여부</span>
              </label>
            </div>

            {/* 옵션 목록 */}
            {product.isOption && (
              <div className="space-y-2">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-semibold">옵션 목록</p>
                  <Button className="flex items-center gap-2" onClick={addOption}>
                    <Plus size={16} />
                    옵션 추가
                  </Button>
                </div>

                <div className="flex gap-4 overflow-x-auto py-2">
                  {product.options.map((opt, idx) => {
                    const base = product.sellPrice || 0;
                    const extra = opt.extraPrice || 0;
                    const final = base + extra;

                    return (
                      <div key={idx} className="flex-shrink-0 w-full flex flex-col gap-2 bg-gray-50 p-3 rounded-lg border">
                        <div className="grid grid-cols-2 gap-2">
                          <OptionDropdown
                            value={opt.optionType}
                            onChange={(val) => updateOption(idx, "optionType", val)}
                          />
                          <Input
                            label="옵션 제목"
                            value={opt.optionTitle}
                            onChange={(e) => updateOption(idx, "optionTitle", e.target.value)}
                          />
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          <Input
                            label="옵션 값"
                            value={opt.optionValue}
                            onChange={(e) => updateOption(idx, "optionValue", e.target.value)}
                          />
                          <Input
                            label="추가금"
                            type="text"
                            value={opt.extraPrice?.toLocaleString()}
                            onChange={(e) => {
                              const numericValue = Number(e.target.value.replace(/,/g, ""));
                              updateOption(idx, "extraPrice", numericValue);
                            }}
                          />
                          <Input
                            label="재고"
                            type="number"
                            value={opt.stock}
                            onChange={(e) => updateOption(idx, "stock", Number(e.target.value))}
                          />
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="text-xs text-gray-600">
                            기본가 {base.toLocaleString()} + 추가금 {extra.toLocaleString()} ={" "}
                            <span className="font-semibold text-black">{final.toLocaleString()}원</span>
                          </div>

                          {opt.optionType === "C" && (
                            <Input
                              label="색상 코드"
                              value={opt.colorCode}
                              onChange={(e) => updateOption(idx, "colorCode", e.target.value)}
                            />
                          )}

                          <button className="text-red-500 cursor-pointer" onClick={() => removeOption(idx)}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 등록 버튼 */}
        <Button className="w-full py-3 text-lg" onClick={handleSave}>
          상품 등록
        </Button>
      </div>
    </div>
  );
}

"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Heart, Plus, Minus, X } from "lucide-react";
import { useUser } from "../../../context/UserContext";
import { useCart } from "../../../context/CartContext";

interface Option {
  optionId: number;
  optionValue: string;
  sellPrice: number;
  stock: number;
  optionType?: string;
  optionTitle?: string;
}

interface SelectedOption {
  optionId: number;
  value: string;
  count: number;
  price: number; // ⭐ 추가: 옵션별 가격
}

interface Product {
  productId: number;
  productName: string;
  description?: string;
  mainImg?: string;
  subImages?: string[];
  consumerPrice?: number;
  sellPrice: number;
  stock: number;
  isOption?: number;
  options?: Option[];
  categoryPath: string;
  likeCount?: number;
  userLiked?: boolean;
}

const toFullUrl = (url: string) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `https://image.msscdn.net${url}`;
};

export default function ProductDetailTop({ product }: { product: Product }) {
  const router = useRouter();
  const { user } = useUser();
  const { addToCart } = useCart();

  if (!product.mainImg) return null;

  /** 좋아요 */
  const [liked, setLiked] = useState(product.userLiked ?? false);
  const [likeCount, setLikeCount] = useState(product.likeCount ?? 0);

  /** 이미지 */
  const initialMainImg = toFullUrl(product.mainImg);
  const [mainImage, setMainImage] = useState(initialMainImg);

  const thumbnails = product.subImages?.length
    ? product.subImages.map((img) => toFullUrl(img))
    : [initialMainImg];

  /** ⭐ 상품 표시 가격 — 옵션 선택 시 변경 */
  const [price, setPrice] = useState(product.sellPrice);

  /** 선택된 옵션들 */
  const [selectedOptions, setSelectedOptions] = useState<SelectedOption[]>([]);

  /** 옵션 Dropdown */
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  /** Dropdown 외부 클릭 감지 */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /** 좋아요 */
  const handleLike = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/like/toggle/${product.productId}`,
        { method: "POST", credentials: "include" }
      );

      if (!res.ok) {
        alert("좋아요 실패");
        return;
      }

      const result = await res.json();
      setLiked(result);
      setLikeCount((prev) => (result ? prev + 1 : Math.max(prev - 1, 0)));
    } catch (err) {
      console.error(err);
    }
  };

  /** ⭐ 옵션 선택 */
  const handleSelectOption = (opt: Option) => {
    if (selectedOptions.some((o) => o.optionId === opt.optionId)) {
      alert("이미 선택된 옵션입니다.");
      return;
    }

    // 기본 가격을 옵션에 맞춰 변경
    setPrice(opt.sellPrice);

    setSelectedOptions((prev) => [
      ...prev,
      {
        optionId: opt.optionId,
        value: opt.optionValue,
        count: 1,
        price: opt.sellPrice,
      },
    ]);

    setDropdownOpen(false);
  };

  /** 장바구니 */
  const handleAddToCart = async () => {
    if (!user) {
      if (window.confirm("로그인이 필요합니다. 이동하시겠습니까?")) {
        router.push("/login");
      }
      return;
    }

    if (product.isOption && selectedOptions.length === 0) {
      alert("옵션을 선택하세요.");
      return;
    }

    for (const opt of selectedOptions) {
      await addToCart(product.productId, opt.optionId, opt.count);
    }

    if (window.confirm("장바구니로 이동할까요?")) {
      router.push("/mypage/cart");
    }
  };

  /** 구매하기 */
  const handleBuyNow = () => {
    if (!user) {
      if (window.confirm("로그인이 필요합니다. 이동하시겠습니까?")) {
        router.push("/login");
      }
      return;
    }

    if (product.isOption && selectedOptions.length === 0) {
      alert("옵션을 선택하세요.");
      return;
    }

    const orderInfo = {
      productId: product.productId,
      productName: product.productName,
      mainImg: product.mainImg,
      sellPrice: price,
      options: selectedOptions,
    };

    sessionStorage.setItem("checkoutData", JSON.stringify(orderInfo));
    router.push("/order/checkout");
  };

  return (
    <div className="max-w-6xl mx-auto my-10 bg-white p-8 rounded-xl shadow flex flex-col">
      <div className="grid md:grid-cols-2 gap-10 items-start">

        {/* ---------------- 이미지 ---------------- */}
        <div className="flex flex-row gap-6">
          <div className="flex flex-col gap-2 overflow-y-auto max-h-[500px] min-w-[5rem]">
            {thumbnails.map((thumb, idx) => (
              <img
                key={idx}
                src={thumb}
                className={`w-20 h-20 object-contain rounded border ${
                  mainImage === thumb ? "border-gray-800" : "border-gray-300"
                } cursor-pointer`}
                onClick={() => setMainImage(thumb)}
              />
            ))}
          </div>

          <div className="flex-1 flex justify-center items-start">
            <img src={mainImage} className="rounded-lg object-contain max-h-[500px] w-full" />
          </div>
        </div>

        {/* ---------------- 상품 정보 ---------------- */}
        <div className="flex flex-col">

          {/* 카테고리 경로 */}
          {product.categoryPath && (
            <div className="text-sm text-gray-500 mb-4">{product.categoryPath}</div>
          )}

          {/* 이름 */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {product.productName}
          </h1>

          {/* 가격 */}
          <div className="mb-6">
            <p className="text-gray-400 text-sm line-through">
              {product.consumerPrice?.toLocaleString()}원
            </p>

            {product.consumerPrice && product.consumerPrice > price && (
              <span className="text-red-500 text-3xl font-bold mr-2">
                {Math.round(((product.consumerPrice - price) / product.consumerPrice) * 100)}%
              </span>
            )}

            <p className="text-3xl font-bold text-black mt-1">
              {price.toLocaleString()}원
            </p>

            <p className="text-gray-600 mt-2 text-sm">재고: {product.stock}개</p>
          </div>

          {/* 옵션 드롭다운 */}
          {product.isOption && product.options?.length ? (
            <div className="mb-6 relative w-full" ref={dropdownRef}>
              <label className="block text-gray-700 mb-2 font-medium">옵션 선택</label>

              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="w-full border border-gray-300 rounded-lg p-2 text-left hover:ring-2 hover:ring-blue-400"
              >
                {selectedOptions.length === 0
                  ? "옵션 선택"
                  : selectedOptions.map((o) => o.value).join(", ")}
              </button>

              {dropdownOpen && (
                <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                  {product.options.map((opt) => (
                    <li
                      key={opt.optionId}
                      onClick={() => handleSelectOption(opt)}
                      className={`p-2 hover:bg-blue-100 cursor-pointer ${
                        selectedOptions.some((o) => o.optionId === opt.optionId)
                          ? "bg-gray-200"
                          : ""
                      }`}
                    >
                      {opt.optionValue} — {opt.sellPrice.toLocaleString()}원
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : null}

          {/* ---------------- 선택된 옵션 BOX ---------------- */}
          <div className="flex flex-col gap-4 mb-6">
            {selectedOptions.map((item) => (
              <div
                key={item.optionId}
                className="border p-4 rounded-lg shadow flex flex-col gap-3"
              >
                {/* 첫째 줄: 옵션명 + 가격 + X */}
                <div className="flex justify-between items-center w-full">
                  <div className="flex items-center gap-4">
                    <p className="font-medium">{item.value}</p>
                    <p className="text-gray-600 text-sm">
                      {item.price.toLocaleString()}원
                    </p>
                  </div>

                  <button
                    className="text-gray-400 hover:text-black"
                    onClick={() =>
                      setSelectedOptions((prev) =>
                        prev.filter((p) => p.optionId !== item.optionId)
                      )
                    }
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* 수량 */}
                <div className="flex items-center gap-3">
                  <button
                    className="p-2 bg-gray-200 rounded"
                    onClick={() =>
                      setSelectedOptions((prev) =>
                        prev.map((p) =>
                          p.optionId === item.optionId
                            ? { ...p, count: Math.max(1, p.count - 1) }
                            : p
                        )
                      )
                    }
                  >
                    <Minus size={16} />
                  </button>

                  <span className="font-semibold">{item.count}</span>

                  <button
                    className="p-2 bg-gray-200 rounded"
                    onClick={() =>
                      setSelectedOptions((prev) =>
                        prev.map((p) =>
                          p.optionId === item.optionId
                            ? { ...p, count: p.count + 1 }
                            : p
                        )
                      )
                    }
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ---------------- 버튼 UI (원본 유지) ---------------- */}
          <div className="flex flex-col md:flex-row items-center gap-4 w-full">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 p-2 border rounded-lg transition-all w-full md:w-auto ${
                liked ? "bg-rose-50 border-rose-300" : "bg-white border-gray-300"
              } hover:cursor-pointer`}
            >
              <Heart
                className={`w-7 h-7 ${
                  liked ? "fill-rose-500 stroke-rose-500" : "stroke-gray-400"
                }`}
              />
              <span
                className={`text-base font-medium ${
                  liked ? "text-rose-500" : "text-gray-500"
                }`}
              >
                {likeCount}
              </span>
            </button>

            <button
              onClick={handleAddToCart}
              className="flex-1 w-full bg-gray-100 text-gray-600 py-3 rounded-lg hover:bg-gray-200 hover:cursor-pointer"
            >
              장바구니
            </button>

            <button
              onClick={handleBuyNow}
              className="flex-1 w-full bg-gray-700 text-white py-3 rounded-lg hover:bg-gray-800 hover:cursor-pointer"
            >
              구매하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

interface CheckoutOption {
  optionId: number;
  value: string;
  count: number;
}

interface CheckoutData {
  productId: number;
  productName: string;
  mainImg?: string;
  sellPrice: number;
  options: CheckoutOption[];
}

interface Address {
  id: number;
  name: string;
  phone: string;
  address: string;
  detail: string;
  isDefault: boolean;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useCart();

  const [directData, setDirectData] = useState<CheckoutData | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const [showNewAddress, setShowNewAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: "",
    phone: "",
    address: "",
    detail: "",
    isDefault: false,
  });

  // -----------------------------
  // 📌 배송지 목록 불러오기 (백엔드)
  // -----------------------------
  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/address", {
        credentials: "include",
      });

      if (!res.ok) throw new Error("배송지 목록 조회 실패");

      const list: Address[] = await res.json();
      setAddresses(list);

      // 기본 배송지 선택 또는 첫 번째 배송지 선택
      const defaultOne = list.find((a) => a.isDefault);
      setSelectedAddress(defaultOne ? defaultOne.id : list[0]?.id || null);
    } catch (err) {
      console.error("배송지 불러오기 오류:", err);
    }
  };

  // -----------------------------
  // 📌 바로 구매 데이터 로딩
  // -----------------------------
  useEffect(() => {
    const checkoutSaved = sessionStorage.getItem("checkoutData");
    if (checkoutSaved) {
      setDirectData(JSON.parse(checkoutSaved));
    }
  }, []);

  // -----------------------------
  // 📌 장바구니 + 바로구매 병합
  // -----------------------------
  const itemsToShow: (CheckoutData & { quantity?: number })[] = [];

  if (directData) itemsToShow.push(directData);

  if (cart && cart.length > 0) {
    itemsToShow.push(
      ...cart.map((c) => ({
        productId: c.productId,
        productName: c.productName,
        mainImg: c.thumbnail,
        sellPrice: c.price,
        options: c.option
          ? [
              {
                optionId: c.option.optionId,
                value: `${c.option.optionTitle} ${c.option.optionValue}`,
                count: c.quantity,
              },
            ]
          : [{ optionId: 0, value: "기본", count: c.quantity }],
      }))
    );
  }

  const totalPrice = itemsToShow.reduce(
    (sum, item) =>
      sum +
      item.options.reduce(
        (optSum, opt) => optSum + item.sellPrice * opt.count,
        0
      ),
    0
  );

  // -----------------------------
  // 📌 신규 배송지 추가 (백엔드)
  // -----------------------------
  const addNewAddress = async () => {
    if (!newAddress.name || !newAddress.phone || !newAddress.address) {
      alert("이름, 전화번호, 주소는 필수입니다.");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/address/add", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAddress),
      });

      if (!res.ok) throw new Error("배송지 추가 실패");

      alert("배송지가 추가되었습니다!");

      // 서버에서 다시 불러오기
      await loadAddresses();
      setShowNewAddress(false);
      setNewAddress({
        name: "",
        phone: "",
        address: "",
        detail: "",
        isDefault: false,
      });
    } catch (err) {
      console.error("배송지 추가 오류:", err);
    }
  };

  // -----------------------------
  // 📌 주문 생성 요청
  // -----------------------------
  const handleOrder = async () => {
    if (!selectedAddress) {
      alert("배송지를 선택해주세요.");
      return;
    }

    const orderData = {
      items: itemsToShow,
      addressId: selectedAddress,
      totalPrice,
    };

    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/api/orders/create", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) throw new Error("결제 실패 (서버 오류)");

      const result = await res.json();
      sessionStorage.setItem("lastOrder", JSON.stringify(result));

      clearCart();
      router.push("/order/complete");
    } catch (err) {
      console.error("결제 실패", err);
      alert("결제 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (itemsToShow.length === 0)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <p className="text-gray-500 text-lg">결제 정보 불러오는 중...</p>
      </div>
    );

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* ----------------------------- */}
        {/* 📌 배송지 목록 */}
        {/* ----------------------------- */}
        <div className="bg-white rounded-2xl shadow p-6 space-y-4">
          <h2 className="text-xl font-semibold text-black">배송지</h2>

          {addresses.map((addr) => (
            <label
              key={addr.id}
              className={`flex justify-between items-center p-4 border rounded-xl cursor-pointer transition-all hover:ring-2 ${
                selectedAddress === addr.id
                  ? "ring-black border-black"
                  : "border-gray-200"
              }`}
            >
              <div className="space-y-1">
                <p className="font-medium text-black">
                  {addr.name}{" "}
                  {addr.isDefault && (
                    <span className="text-sm text-gray-500">(기본)</span>
                  )}
                </p>
                <p className="text-gray-600 text-sm">
                  {addr.address} {addr.detail}
                </p>
                <p className="text-gray-600 text-sm">{addr.phone}</p>
              </div>

              <input
                type="radio"
                checked={selectedAddress === addr.id}
                onChange={() => setSelectedAddress(addr.id)}
                className="h-5 w-5 text-black"
              />
            </label>
          ))}

          {/* ----------------------------- */}
          {/* 배송지 직접 입력 */}
          {/* ----------------------------- */}
          <button
            onClick={() => setShowNewAddress(!showNewAddress)}
            className="text-black hover:underline mt-2 text-sm cursor-pointer"
          >
            {showNewAddress ? "입력 취소" : "배송지 직접 입력"}
          </button>

          {showNewAddress && (
            <div className="mt-3 bg-gray-50 p-4 border rounded-xl space-y-3">
              <input
                type="text"
                placeholder="이름"
                value={newAddress.name}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, name: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2"
              />
              <input
                type="text"
                placeholder="전화번호"
                value={newAddress.phone}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, phone: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2"
              />
              <input
                type="text"
                placeholder="주소"
                value={newAddress.address}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, address: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2"
              />
              <input
                type="text"
                placeholder="상세 주소"
                value={newAddress.detail}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, detail: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2"
              />

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newAddress.isDefault}
                  onChange={() =>
                    setNewAddress({
                      ...newAddress,
                      isDefault: !newAddress.isDefault,
                    })
                  }
                />
                기본 배송지 설정
              </label>

              <button
                onClick={addNewAddress}
                className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-900 font-semibold transition"
              >
                배송지 추가
              </button>
            </div>
          )}
        </div>

        {/* ----------------------------- */}
        {/* 주문 상품 */}
        {/* ----------------------------- */}
        <div className="bg-white rounded-2xl shadow p-6 space-y-4">
          <h2 className="text-xl font-semibold text-black">주문 상품</h2>

          {itemsToShow.map((item) =>
            item.options.map((opt) => (
              <div
                key={`${item.productId}-${opt.optionId}`}
                className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl shadow-sm"
              >
                <img
                  src={item.mainImg || "/images/default_main.png"}
                  className="w-20 h-20 object-contain rounded border"
                />

                <div className="flex-1">
                  <p className="font-medium text-black">{item.productName}</p>
                  <p className="text-gray-500 text-sm">{opt.value}</p>
                  <p className="text-gray-500 text-sm">수량: {opt.count}</p>
                </div>

                <div className="text-right font-semibold text-black">
                  {(item.sellPrice * opt.count).toLocaleString()}원
                </div>
              </div>
            ))
          )}
        </div>

        {/* ----------------------------- */}
        {/* 결제 금액 */}
        {/* ----------------------------- */}
        <div className="bg-white rounded-2xl shadow p-6 flex justify-between items-center">
          <span className="text-black font-medium text-lg">총 결제 금액</span>
          <span className="text-red-600 font-bold text-xl">
            {totalPrice.toLocaleString()}원
          </span>
        </div>

        {/* ----------------------------- */}
        {/* 결제 버튼 */}
        {/* ----------------------------- */}
        <div className="text-center">
          <button
            onClick={handleOrder}
            disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold text-white cursor-pointer transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-black hover:bg-gray-900"
            }`}
          >
            {loading
              ? "결제 진행중..."
              : `${totalPrice.toLocaleString()}원 결제하기`}
          </button>
        </div>
      </div>
    </div>
  );
}

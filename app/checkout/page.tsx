"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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

export default function CheckoutPage() {
  const router = useRouter();
  const [data, setData] = useState<CheckoutData | null>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem("checkoutData");

    if (!saved) {
      alert("결제할 상품 정보가 없습니다.");
      router.push("/");
      return;
    }

    setData(JSON.parse(saved));
  }, [router]);

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-start pt-32">
        결제 정보 불러오는 중...
        <img
          src="/images/signature_w.png"
          alt="Loading"
          className="inline-block w-8 h-8 md:w-20 md:h-20 mx-[2px] -mb-2 animate-spin-slow"
        />
      </div>
    );
  }

  const totalPrice =
    data.options.reduce((sum, o) => sum + data.sellPrice * o.count, 0);

  const handleOrder = () => {
    alert("주문 완료! (테스트)");
    router.push("/");
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-5">
      <h1 className="text-3xl font-bold mb-8 text-center">결제하기</h1>

      <div className="bg-white shadow rounded-xl p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">주문 상품</h2>

        <div className="flex gap-4 items-center mb-6">
          <img
            src={data.mainImg || "/images/default_main.png"}
            className="w-28 h-28 object-contain rounded-lg border"
          />
          <div>
            <p className="text-lg font-bold">{data.productName}</p>
            <p className="text-gray-600">{data.sellPrice.toLocaleString()}원</p>
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="text-lg font-medium mb-3">선택 옵션</h3>

          {data.options.map((opt) => (
            <div
              key={opt.optionId}
              className="flex justify-between border-b py-3"
            >
              <span className="text-gray-800">
                {opt.value} × {opt.count}
              </span>
              <span className="font-semibold">
                {(data.sellPrice * opt.count).toLocaleString()}원
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 총 결제 정보 */}
      <div className="bg-white shadow rounded-xl p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">결제 금액</h2>

        <div className="flex justify-between text-lg font-bold">
          <span>총 금액</span>
          <span className="text-red-600">
            {totalPrice.toLocaleString()}원
          </span>
        </div>
      </div>

      {/* 결제 버튼 */}
      <button
        onClick={handleOrder}
        className="w-full bg-black text-white py-4 rounded-xl text-lg font-semibold hover:bg-gray-900"
      >
        결제하기
      </button>
    </div>
  );
}

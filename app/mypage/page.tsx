"use client";
import { useUser } from "../../context/UserContext";
import Link from "next/link";
import { User, CreditCard, ShoppingBag, Heart, Gift, LogOut, ChevronRight } from "lucide-react";

export default function MyPage() {
  const { user } = useUser();

  const menuSections = [
    {
      title: "주문/배송",
      items: [
        { title: "결제 내역", href: "/order/history", icon: <CreditCard className="w-5 h-5" /> },
        // { title: "취소/반품/교환", href: "#", icon: <ShoppingBag className="w-5 h-5" /> },
      ],
    },
    {
      title: "쇼핑 관리",
      items: [
        { title: "장바구니", href: "/mypage/cart", icon: <ShoppingBag className="w-5 h-5" /> },
        { title: "찜한 상품", href: "/mypage/wishlist", icon: <Heart className="w-5 h-5" /> },
        // { title: "재입고 알림", href: "#", icon: <Gift className="w-5 h-5" /> },
      ],
    },
    {
      title: "계정",
      items: [
        { title: "내 정보 수정", href: "/mypage/edit", icon: <User className="w-5 h-5" /> },
        { title: "로그아웃", href: "/logout", icon: <LogOut className="w-5 h-5" /> },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-10 px-4 space-y-6">
        {/* 프로필 카드 */}
        <div className="bg-white rounded-xl shadow p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="text-gray-500 w-8 h-8" />
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-800">
                {user ? `${user.name} 님` : "로그인이 필요합니다"}
              </p>
              <p className="text-sm text-gray-500">LV.2 프렌즈 · 무료배송</p>
            </div>
          </div>
          {user ? (
            <Link href="/mypage/edit" className="text-sm text-gray-500 hover:text-gray-800">
              내 정보 수정
            </Link>
          ) : (
            <Link href="/login" className="text-sm text-blue-600 hover:underline">
              로그인 →
            </Link>
          )}
        </div>

        {/* 요약 카드 */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl shadow text-center cursor-pointer hover:bg-gray-50">
            <p className="text-gray-500 text-sm mb-1">적립금</p>
            <p className="text-lg font-bold text-gray-800">0원</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow text-center cursor-pointer hover:bg-gray-50">
            <p className="text-gray-500 text-sm mb-1">쿠폰</p>
            <p className="text-lg font-bold text-gray-800">3장</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow text-center cursor-pointer hover:bg-gray-50">
            <p className="text-gray-500 text-sm mb-1">후기</p>
            <p className="text-lg font-bold text-blue-600">1개</p>
          </div>
        </div>

        {/* 메뉴 섹션 */}
        {menuSections.map((section, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow divide-y">
            <h2 className="px-6 py-3 font-semibold text-gray-700">{section.title}</h2>
            {section.items.map((item, i) => (
              <Link
                key={i}
                href={item.href}
                className="flex justify-between items-center px-6 py-4 hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-3 text-gray-700">
                  {item.icon}
                  <span>{item.title}</span>
                </div>
                <ChevronRight className="text-gray-400 w-4 h-4" />
              </Link>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

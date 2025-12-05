"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../context/UserContext";
import { useCart } from "../context/CartContext";
import { Search, Menu } from "lucide-react";
import Sidebar from "./Sidebar";
import SidebarContent from "./SidebarContent";

export default function Header() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const { user, setUser } = useUser();
  const { loadCart } = useCart();
  const router = useRouter();

  const [keyword, setKeyword] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!keyword.trim()) return;
    router.push(`/search?keyword=${keyword}`);
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch { }

    setUser(null);
    localStorage.removeItem("user");
    loadCart();
    router.push("/");
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full bg-gray-900 text-white shadow-md z-50 border-b border-gray-700">
        <div className="max-w-7xl mx-auto h-16 px-6 flex items-center justify-between gap-6">
          <div className="flex items-center gap-12 flex-1">
            {/* 로고 */}
            <Link href="/" className="flex-shrink-0">
              <img src="/images/logo.png" alt="Logo" className="h-10 w-auto" />
            </Link>

            {/* 검색창 */}
            <form onSubmit={handleSearch} className="max-w-sm relative flex-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Your Daily Journey"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-full py-2 pl-10 pr-4 text-sm text-white placeholder-gray-400 focus:outline-none"
              />
            </form>
          </div>

          {/* 오른쪽 메뉴 */}
          <div className="flex items-center gap-4 text-sm">

            {user ? (
              <>
                {/* 관리자 아닐 때만 환영 문구 출력 */}
                {user.role?.trim().toUpperCase() !== "ADMIN" && (
                  <span className="text-white whitespace-nowrap overflow-hidden">
                    <b>{user.name}</b> 님 환영합니다
                  </span>
                )}

                {/* 관리자일 때 출력되는 메뉴 */}
                {user.role?.trim().toUpperCase() === "ADMIN" && (
                  <Link href="/admin" className="hover:text-gray-300">
                    상품 관리
                  </Link>
                )}

                <Link href="/mypage" className="hover:text-gray-300">
                  마이페이지
                </Link>

                <button
                  onClick={handleLogout}
                  className="hover:text-gray-300 cursor-pointer"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="hover:text-gray-300">
                  로그인
                </Link>
                <Link href="/join" className="hover:text-gray-300">
                  회원가입
                </Link>
              </>
            )}

            {/* 모바일 메뉴 버튼 */}
            <button
              className="relative w-10 h-10 flex items-center justify-center cursor-pointer z-[999]"
              onClick={() => setMenuOpen(true)}
            >
              <Menu />
            </button>
          </div>
        </div>
      </header>

      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)}>
        <SidebarContent user={user} onClose={() => setMenuOpen(false)} />
      </Sidebar>
    </>
  );
}

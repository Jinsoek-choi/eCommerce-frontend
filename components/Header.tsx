"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../context/UserContext";

export default function Header() {
  const { user, setUser } = useUser();
  const router = useRouter();

  const [keyword, setKeyword] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!keyword) return;
    router.push(`/search?keyword=${keyword}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("user_name");
    setUser(null);
    setMenuOpen(false);
  };

  return (
    <header className="w-full h-16 bg-gray-900 text-white flex justify-between items-center px-6 shadow-md relative">

      {/* 로고 */}
      <div className="text-xl font-bold">
        <Link href="/">E-Commerce</Link>
      </div>

      {/* 검색 박스 */}
      <form onSubmit={handleSearch} className="flex-1 flex justify-center">
        <input
          type="text"
          placeholder="검색"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="w-64 px-4 py-2 bg-white text-black placeholder-gray-400 rounded-full text-center focus:outline-none"
        />
      </form>

      {/* 로그인 / 회원가입 / 로그아웃 */}
      <ul className="hidden md:flex gap-3 items-center mr-3">
        <li>
          {user ? (
            <span className="px-3 py-1">{user.user_name}님</span>
          ) : (
            <Link href="/login" className="px-3 py-1 hover:text-blue-500 transition">
              로그인
            </Link>
          )}
        </li>
        <li>
          {user ? (
            <button
              onClick={handleLogout}
              className="px-3 py-1 hover:text-gray-600 transition"
            >
              로그아웃
            </button>
          ) : (
            <Link href="/signup" className="px-3 py-1 hover:text-blue-500 transition">
              회원가입
            </Link>
          )}
        </li>
      </ul>

      {/* 햄버거 버튼 */}
      <button
        className="relative w-6 h-6 flex flex-col justify-between items-center group"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span
          className={`block h-1 w-full bg-white rounded transition-transform duration-300 ease-in-out
            ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
        />
        <span
          className={`block h-1 w-full bg-white rounded transition-opacity duration-300 ease-in-out
            ${menuOpen ? "opacity-0" : "opacity-100"}`}
        />
        <span
          className={`block h-1 w-full bg-white rounded transition-transform duration-300 ease-in-out
            ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
        />
      </button>

      {/* 드롭다운 메뉴 */}
      <div
        className={`absolute right-6 top-16 w-40 bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden text-center z-50
          transition-all duration-300
          ${menuOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-3 pointer-events-none"}`}
      >
        <Link
          href="/mypage"
          onClick={() => setMenuOpen(false)}
          className="block px-3 py-3 hover:bg-gray-700 transition"
        >
          마이페이지
        </Link>
        <Link
          href="/cart"
          onClick={() => setMenuOpen(false)}
          className="block px-3 py-3 hover:bg-gray-700 transition"
        >
          장바구니
        </Link>
        {user && (
          <button
            onClick={handleLogout}
            className="w-full px-3 py-3 hover:bg-gray-700 transition text-left"
          >
            로그아웃
          </button>
        )}
      </div>
    </header>
  );
}

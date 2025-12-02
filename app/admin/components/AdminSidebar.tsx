// components/AdminSidebar.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, ChevronUp, Home } from "lucide-react";

interface SidebarProps {
  active?: string;
}

export default function AdminSidebar({ active }: SidebarProps) {
  const [isProductOpen, setIsProductOpen] = useState(true);

  const linkClasses = (isActive?: boolean) =>
    `block px-4 py-2 rounded cursor-pointer transition-colors text-sm ${
      isActive
        ? "font-semibold bg-gray-700 text-white"
        : "text-gray-200 hover:bg-gray-700 hover:text-white"
    }`;

  return (
    <aside className="fixed top-0 left-0 w-56 h-screen bg-gray-900 shadow-md flex flex-col text-white">

      {/* 로고 영역 */}
      <div className="flex flex-col items-center justify-center py-8 border-b border-gray-700">
        <Link href="/admin">
          <Image
            src="/images/logo.png"
            alt="Admin Logo"
            width={140}
            height={60}
            className="object-contain"
          />
        </Link>
      </div>

      {/* 메뉴 영역 */}
      <nav className="flex-1 flex flex-col p-2 overflow-y-auto">

        {/* 상품 관리 드롭다운 */}
        <div className="border-b border-gray-700 pb-2 mb-2">
          <button
            onClick={() => setIsProductOpen(!isProductOpen)}
            className="w-full flex justify-between items-center px-4 py-2 rounded hover:bg-gray-700 transition-colors font-medium text-gray-200"
          >
            상품 관리
            {isProductOpen ? (
              <ChevronUp size={18} className="text-gray-400 hover:text-white transition-colors" />
            ) : (
              <ChevronDown size={18} className="text-gray-400 hover:text-white transition-colors" />
            )}
          </button>

          {isProductOpen && (
            <div className="flex flex-col ml-3 mt-1 space-y-1">
              <Link
                href="/admin/productNew"
                className={linkClasses(active === "create")}
              >
                상품 등록
              </Link>
              
            </div>
          )}
        </div>

        {/* 메뉴 목록 */}
        <Link
          href="/admin/list"
          className={linkClasses(active === "list")}
        >
          상품 목록
        </Link>

        {/* 홈 버튼 */}
        <div className="mt-auto px-4 py-4">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 p-2 rounded hover:bg-gray-700 transition-colors"
          >
            <Home size={36} className="text-gray-200 hover:text-white" />
          </Link>
        </div>

      </nav>
    </aside>
  );
}

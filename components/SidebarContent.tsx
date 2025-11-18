"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Heart, ShoppingCart, LogIn, UserPlus } from "lucide-react";
import { CATEGORY_TREE } from "../app/lib/categories";


interface SidebarContentProps {
  user: any;
  onClose: () => void;
}

export default function SidebarContent({ user, onClose }: SidebarContentProps) {
  const [search, setSearch] = useState("");
  const [openMain, setOpenMain] = useState<string | null>(null);
  const [openSub, setOpenSub] = useState<string | null>(null);

  /* 검색 시 자동으로 대분류 + 중분류 펼침 */
  useEffect(() => {
    if (!search) return;

    setOpenMain(null);
    setOpenSub(null);

    for (const [mainCode, mainData] of Object.entries(CATEGORY_TREE)) {
      for (const [subCode, subData] of Object.entries(mainData.children)) {
        const leafFound = Object.entries(subData.children).some(
          ([_, leafName]) => leafName.includes(search)
        );

        if (subData.title.includes(search) || leafFound) {
          setOpenMain(mainCode);
          setOpenSub(subCode);
          return;
        }
      }
    }
  }, [search]);

  return (
    <div className="w-full h-full flex flex-col">

      {/* 사이드바 사용자 */}
      <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">

        {/* 로그인 / 회원가입 */}
        <div className="text-base font-semibold flex items-center gap-4">
          {user ? (
            <Link href="/mypage" onClick={onClose} className="hover:text-blue-500">
              {user.name}님
            </Link>
          ) : (
            <>
              <Link href="/login" onClick={onClose} className="flex items-center gap-1 text-gray-700 hover:text-black">
                <LogIn size={20} strokeWidth={1.75} />
                로그인
              </Link>

              <Link href="/signup" onClick={onClose} className="flex items-center gap-1 text-gray-700 hover:text-black">
                <UserPlus size={20} strokeWidth={1.75} />
                회원가입
              </Link>
            </>
          )}
        </div>

        {/* 하트 + 장바구니 */}
        <div className="flex items-center gap-5">
          <Link href="/wishlist" onClick={onClose}>
            <Heart size={22} strokeWidth={1.75} className="text-gray-600 hover:text-black" />
          </Link>

          <Link href="/cart" onClick={onClose}>
            <ShoppingCart size={22} strokeWidth={1.75} className="text-gray-600 hover:text-black" />
          </Link>
        </div>

      </div>

      {/* 카테고리 검색 */}
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex items-center bg-gray-100 rounded-lg px-3">
          <Search size={16} className="text-gray-500" />
          <input
            type="text"
            placeholder="카테고리를 검색하세요"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent w-full px-2 py-2 outline-none text-sm"
          />
        </div>
      </div>

      {/* 카테고리 목록 */}
      <div className="flex-1 overflow-y-auto py-2">
        {Object.entries(CATEGORY_TREE).map(([mainCode, mainData]) => {
          const mainMatch =
            mainData.title.includes(search) ||
            Object.values(mainData.children).some((sub) =>
              sub.title.includes(search)
            );

          if (search && !mainMatch) return null;

          return (
            <div key={mainCode}>
              {/* 대분류 */}
              <button
                onClick={() =>
                  setOpenMain(openMain === mainCode ? null : mainCode)
                }
                className="w-full text-left px-5 py-3 font-semibold hover:bg-gray-100"
              >
                {mainData.title}
              </button>

              {/* 중분류 */}
              {openMain === mainCode &&
                Object.entries(mainData.children).map(([subCode, subData]) => {
                  const subMatch =
                    subData.title.includes(search) ||
                    Object.values(subData.children).some((leaf) =>
                      leaf.includes(search)
                    );

                  if (search && !subMatch) return null;

                  return (
                    <div key={subCode} className="ml-4">
                      <button
                        onClick={() =>
                          setOpenSub(openSub === subCode ? null : subCode)
                        }
                        className="w-full text-left px-5 py-2 text-sm hover:bg-gray-100"
                      >
                        {subData.title}
                      </button>

                      {/* 소분류 */}
                      {openSub === subCode &&
                        Object.entries(subData.children).map(
                          ([leafCode, leafName]) => (
                            <Link
                              key={leafCode}
                              href={`/category/${leafCode}`}
                              onClick={onClose}
                              className="block ml-6 px-5 py-1 text-sm text-gray-600 hover:text-black hover:bg-gray-100"
                            >
                              {leafName}
                            </Link>
                          )
                        )}
                    </div>
                  );
                })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

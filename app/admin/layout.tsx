<<<<<<< HEAD
"use client";

import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { LogOut } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, setUser } = useUser();
  const router = useRouter();

  // 권한 체크
  useEffect(() => {
    if (!user || user.role !== "ADMIN") {
      router.replace("/");
    }
  }, [user]);

  if (!user || user.role !== "ADMIN") return null;

  const handleLogout = () => {
    setUser(null);
    router.push("/");
  };

  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* 🔵 좌측 관리자 사이드바 */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col py-8 px-6 gap-8">

        {/* 메뉴 */}
        <nav className="flex flex-col gap-4 text-base">
          <Link href="/admin/products" className="hover:text-blue-300">상품 관리</Link>
          <Link href="/admin/products/create" className="hover:text-blue-300">상품 등록</Link>
          <Link href="/admin/products/list" className="hover:text-blue-300">상품 목록</Link>

        </nav>

        {/* 로그아웃 */}
        <button
          onClick={handleLogout}
          className="mt-auto flex items-center gap-2 text-red-400 hover:text-red-300"
        >
          <LogOut size={18} />
          로그아웃
        </button>
      </aside>

      {/* 🔶 메인 영역 */}
      <main className="flex-1 p-10">{children}</main>
    </div>
=======
import AdminSidebar from "@/app/admin/components/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
      <div>
        <div className="flex">
          <AdminSidebar />
          <main className="flex-1 p-6 ml-52">
            {children}
          </main>
        </div>
      </div>
>>>>>>> main
  );
}

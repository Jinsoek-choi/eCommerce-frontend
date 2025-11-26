"use client";

import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AdminSidebar from "./components/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const router = useRouter();

  // 🛑 관리자 아닌 경우 접근 막기
  useEffect(() => {

    const role = user?.role?.trim().toUpperCase();
    
    if (!user || user.role !== "ADMIN") {
      router.replace("/");
    }
  }, [user]);

  if (!user || user.role !== "ADMIN") return null;

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/*  사이드바 */}
      <AdminSidebar active="" />

      {/* ✔ 오른쪽 메인 영역 */}
      <main className="flex-1 p-10 ml-52">
        {children}
      </main>
    </div>
  );
}

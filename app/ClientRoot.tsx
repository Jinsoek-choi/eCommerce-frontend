"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, ReactNode } from "react";
import Intro from "./intro/Intro";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function ClientRoot({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  // 🔹 인트로 상태
  const [showIntro, setShowIntro] = useState<boolean | null>(null);

  // 인트로가 끝나면 호출될 함수
  const handleIntroFinish = () => {
    setShowIntro(false); // 인트로 완료 후 화면을 바꿈
  };

  useEffect(() => {
    const seen = sessionStorage.getItem("introSeen");
    setShowIntro(seen === "true" ? false : true);
  }, []);

  // 인트로 체크 전에는 아무것도 렌더링 금지
  if (showIntro === null) return null;

  // 인트로 표시
  if (showIntro) return <Intro onFinish={handleIntroFinish} />; // Intro에 onFinish 전달

  return (
    <>
      {!isAdmin && <Header />}

      <div className={`flex-1 bg-gray-100 overflow-x-hidden ${!isAdmin ? "py-16" : ""}`}>
        <div className="mx-auto">{children}</div>
      </div>

      {!isAdmin && <Footer />}
    </>
  );
}

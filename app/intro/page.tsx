"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function IntroPage() {
  const router = useRouter();
  const introLines = ["Your Daily", "Journey"];
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem("introSeen");

    // 이미 인트로 본 적 있으면 바로 홈으로 이동
    if (seen === "true") {
      router.push("/");
      return;
    }

    setMounted(true);

    // 3초 후 자동으로 홈 이동 + introSeen 저장
    const timer = setTimeout(() => {
      sessionStorage.setItem("introSeen", "true");
      router.push("/");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  const goHome = () => {
    sessionStorage.setItem("introSeen", "true");
    router.push("/");
  };

  const renderLine = (line: string, lineIdx: number) => {
    const chars = line.split("");

    const delays = mounted
      ? chars
          .map((_, i) => i)
          .sort(() => Math.random() - 0.5)
          .map((i) => i * 0.1)
      : chars.map(() => 0);

    return chars.map((char, idx) => {
      const delay = delays[idx];

      // Journey 의 O 를 이미지로 변경
      if (lineIdx === 1 && char.toLowerCase() === "o") {
        return (
          <img
            key={idx}
            src="/images/signature_b.png"
            alt="O"
            style={{ animationDelay: `${delay}s` }}
            className="inline-block w-16 h-16 md:w-20 md:h-20 mx-[2px] -mb-2 animate-spin-slow"
          />
        );
      }

      return (
        <span
          key={idx}
          style={{ animationDelay: `${delay}s` }}
          className="inline-block mx-[1px] opacity-0 animate-spreadFade"
        >
          {char}
        </span>
      );
    });
  };

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white">
      {introLines.map((line, idx) => (
        <h1
          key={idx}
          className="text-6xl md:text-8xl font-extrabold text-center leading-tight text-black"
        >
          {renderLine(line, idx)}
        </h1>
      ))}

      <button
        onClick={goHome}
        className="mt-10 px-8 py-4 bg-gray-700 text-white rounded-full text-xl font-semibold cursor-pointer"
      >
        Shop Now
      </button>
    </div>
  );
}

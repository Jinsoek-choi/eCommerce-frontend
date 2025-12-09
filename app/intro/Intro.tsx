"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";

export default function Intro() {
  const router = useRouter();
  const introLines = ["Your Daily", "Journey"];
  const [ready, setReady] = useState(false);

  // 🔥 hydration 안전하게 만들기
  useEffect(() => {
    setReady(true);
  }, []);

  // 🔥 CSR이 된 후에만 introSeen 체크
  useEffect(() => {
    if (!ready) return;

    const seen = sessionStorage.getItem("introSeen");

    if (seen === "true") {
      router.replace("/");
      return;
    }

    const timer = setTimeout(() => {
      sessionStorage.setItem("introSeen", "true");
      router.replace("/");
    }, 3000);

    return () => clearTimeout(timer);
  }, [ready, router]);

  const goHome = () => {
    sessionStorage.setItem("introSeen", "true");
    router.replace("/");
  };

  // 🔥 line 길이에 맞춰 랜덤 딜레이 2줄 생성
  const delays = useMemo(() => {
    return introLines.map((line) =>
      line
        .split("")
        .map((_, i) => i)
        .sort(() => Math.random() - 0.5)
        .map((i) => i * 0.1)
    );
  }, []);

  if (!ready) return null;

  const renderLine = (line: string, lineIdx: number) => {
    const chars = line.split("");

    return chars.map((char, idx) => {
      const delay = delays[lineIdx][idx];

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


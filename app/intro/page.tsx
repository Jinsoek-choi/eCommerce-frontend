"use client";
import Intro from "./Intro";

export default function IntroPage() {
  // onFinish 함수 정의
  const handleIntroFinish = () => {
    // 인트로가 끝났을 때 실행될 동작
    console.log("Intro finished!");
  };

  return <Intro onFinish={handleIntroFinish} />;
}

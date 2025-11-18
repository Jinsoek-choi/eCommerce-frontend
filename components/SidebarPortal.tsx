"use client";

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

export default function SidebarPortal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

    // 클라이언트에서만 렌더되게
  if (!mounted) return null;

  return createPortal(children, document.body); // ★ body 바로 아래로 강제 렌더링
}

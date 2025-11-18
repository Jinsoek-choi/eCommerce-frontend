"use client";

import { useEffect, useRef } from "react";
import SidebarPortal from "./SidebarPortal";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Sidebar({ open, onClose, children }: SidebarProps) {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const endX = useRef(0);

  /* ESC 닫기 */
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  /* body 스크롤 락 */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  /* 모바일 스와이프 */
  useEffect(() => {
    const sidebar = sidebarRef.current;
    if (!sidebar) return;

    const handleTouchStart = (e: TouchEvent) => {
      startX.current = e.touches[0].clientX;
    };
    const handleTouchMove = (e: TouchEvent) => {
      endX.current = e.touches[0].clientX;
    };
    const handleTouchEnd = () => {
      const diff = startX.current - endX.current;
      if (diff > 50) onClose();
    };

    sidebar.addEventListener("touchstart", handleTouchStart);
    sidebar.addEventListener("touchmove", handleTouchMove);
    sidebar.addEventListener("touchend", handleTouchEnd);

    return () => {
      sidebar.removeEventListener("touchstart", handleTouchStart);
      sidebar.removeEventListener("touchmove", handleTouchMove);
      sidebar.removeEventListener("touchend", handleTouchEnd);
    };
  }, [onClose]);

  return (
    <SidebarPortal>
      <>
        {/* 오버레이 */}
        <div
          className={`
            fixed inset-0 bg-black/50 z-[9998] transition-opacity duration-300
            ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
          `}
          onClick={onClose}
        />

        {/* 사이드바 */}
        <div
          ref={sidebarRef}
          className={`
            fixed top-0 right-0 
            w-72 sm:w-80 lg:w-[420px]
            h-full bg-white z-[9999] shadow-xl
            transform transition-transform duration-300
            ${open ? "translate-x-0" : "translate-x-full"}
          `}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </>
    </SidebarPortal>
  );
}

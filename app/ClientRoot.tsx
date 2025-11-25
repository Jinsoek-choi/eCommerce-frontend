"use client";

import Header from "../components/Header";
import Footer from "../components/Footer";
import { usePathname } from "next/navigation";

export default function ClientRoot({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <>
      {!isAdmin && <Header />}

      <main className={`flex-1 bg-gray-100 overflow-x-hidden ${!isAdmin ? "py-16" : ""}`}>
        <div className="mx-auto">
          {children}
        </div>
      </main>

      {!isAdmin && <Footer />}
    </>
  );
}

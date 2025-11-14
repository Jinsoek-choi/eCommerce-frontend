"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  name: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // ⬇ 첫 렌더 시 localStorage에서 로그인 정보 불러오기
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // ⬇ user 상태가 변하면 localStorage도 자동 업데이트
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user)); // 로그인 시 저장
    } else {
      localStorage.removeItem("user"); // 로그아웃 시 삭제
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface User {
  id: number;
  name: string;
  email: string;
  role: string; // ADMIN / USER
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  refreshUser: () => Promise<void>; // 세션 기반 유저 조회
}

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  refreshUser: async () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<User | null>(null);

  /** localStorage + 상태 업데이트 */
  const setUser = (data: User | null) => {
    if (data) localStorage.setItem("user", JSON.stringify(data));
    else localStorage.removeItem("user");
    setUserState(data);
  };

  /** 🌟 세션 기반 로그인 확인 */
  const refreshUser = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/auth/me", {
        credentials: "include",
      });

      if (!res.ok) {
        setUser(null);
        return;
      }

      const data = await res.json();
      setUser(data); // 세션 있는 경우 user 저장

    } catch {
      setUser(null);
    }
  };

  /** 앱 첫 로드 시 로그인 복원 */
  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

"use client";

import axios from "@/context/axiosConfig";
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
  role: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  refreshUser: async () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [user, setUserState] = useState<User | null>(null);

  /** User 상태 업데이트 */
  const setUser = (data: User | null) => {
    setUserState(data);
  };

  /** 세션 기반 로그인 복원 */
  const refreshUser = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/auth/me`);
      setUserState(res.data);
    } catch (error) {
      // 401 → 자동 로그아웃 처리됨 (axiosConfig 사용 가정)
      setUserState(null);
    }
  };

  /** 앱 첫 로드시 로그인 체크 */
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

"use client";

import React, { 
  createContext, 
  useContext, 
  useState, 
  useEffect,
  ReactNode 
} from 'react';
import { useRouter } from 'next/navigation';

// 1. User 데이터 타입 정의
interface User {
  id: number;
  name: string;
  email: string;
  profileImage: string;
  role: string;
  communityName: string;
  stats?: {
    posts: number;
    participatingChats: number;
    comments: number;
    likes: number;
  };
}

// 2. Context 타입 정의
interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (accessToken: string, userData: User) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

// 3. Context 생성
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 4. Provider 정의
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  
  // 초기 로드 시 확인
  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse stored data", e);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  // 💡 [핵심 수정] 로그인 함수: 이미지 경로 수리 로직 추가
  const login = (accessToken: string, userData: User) => {

    // 1. 사용자 정보 복사 (불변성 유지)
    const processedUser = { ...userData };

    // 2. 이미지 경로 수정 (백엔드 요청사항 반영)
    if (processedUser.profileImage) {
      let imgPath = processedUser.profileImage;

      // (1) 슬래시 누락 수정: "/uploads..." -> "/uploads/..."
      if (imgPath.startsWith("/uploads") && !imgPath.startsWith("/uploads/")) {
        imgPath = imgPath.replace("/uploads", "/uploads/");
      }

      // (2) 전체 URL로 변경: "http"가 없으면 백엔드 주소 붙이기
      // 기본 이미지가 아닐 경우에만 적용
      if (!imgPath.startsWith("http") && imgPath !== "default.png") {
        imgPath = `http://localhost:8080${imgPath}`;
      }

      processedUser.profileImage = imgPath;
      console.log("이미지 경로 수정됨:", processedUser.profileImage);
    }

    // 3. 상태 및 스토리지 업데이트
    setToken(accessToken);
    setUser(processedUser);
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('user', JSON.stringify(processedUser));
  };

  // 로그아웃 함수
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    router.push('/login');
  };

  // 사용자 정보 새로고침 함수
  const refreshUser = async () => {
    const storedToken = localStorage.getItem('accessToken');
    if (!storedToken) return;

    try {
      const response = await fetch('/api/me', {
        headers: {
          'Authorization': `Bearer ${storedToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const userData = data.data || data;

        // 이미지 경로 수정 로직 적용
        const processedUser = { ...userData };
        if (processedUser.profileImage) {
          let imgPath = processedUser.profileImage;

          if (imgPath.startsWith("/uploads") && !imgPath.startsWith("/uploads/")) {
            imgPath = imgPath.replace("/uploads", "/uploads/");
          }

          if (!imgPath.startsWith("http") && imgPath !== "default.png") {
            imgPath = `http://localhost:8080${imgPath}`;
          }

          processedUser.profileImage = imgPath;
        }

        setUser(processedUser);
        localStorage.setItem('user', JSON.stringify(processedUser));
      }
    } catch (error) {
      console.error("Failed to refresh user:", error);
    }
  };

  const contextValue: AuthContextType = {
    user,
    token,
    isLoading,
    login,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

// 5. 커스텀 훅
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
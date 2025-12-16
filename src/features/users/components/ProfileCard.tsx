"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FileText, MessageCircle, Heart, User, LogIn, MessageSquare, LogOut } from "lucide-react";
import { useAuth } from '@/features/auth/AuthContext'; 

interface ProfileCardProps {
  currentCommunityId?: number;
}

export default function ProfileCard({ currentCommunityId }: ProfileCardProps) {
  const router = useRouter();
  const { user, isLoading, logout } = useAuth(); 

  const handleLogin = () => {
    router.push("/login");
  };

  const handleWrite = () => {
    if (currentCommunityId) {
      router.push(`/post?category=${currentCommunityId}`);
    } else {
      router.push("/post");
    }
  };

  const handleLogout = (e: React.MouseEvent) => {
    e.stopPropagation();
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    window.location.reload();
  };
    
  if (isLoading) {
    return (
      <Card className="sticky top-24 shadow-sm border-gray-200 p-8 min-w-[240px] h-[450px] flex items-center justify-center">
        <p className="text-gray-400">로딩 중...</p>
      </Card>
    );
  }

  return (
    <Card 
      onClick={() => user && router.push("/mypage")}
      className={`sticky top-24 shadow-sm border-gray-200 transition-colors group min-w-[240px] ${user ? 'cursor-pointer hover:border-slate-300' : ''}`}
    >
      {/* 로그아웃 버튼 */}
      {user && (
        <button
          onClick={handleLogout}
          className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 text-xs text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
        >
          <span>로그아웃</span>
          <LogOut className="w-3 h-3" />
        </button>
      )}

      <CardContent className="flex flex-col items-center pt-8 pb-6 px-6">
        
        {/* 1. 프로필 사진 */}
        <Avatar className={`w-20 h-20 mb-4 ring-4 ring-gray-50 ${user ? 'group-hover:ring-slate-200 transition-all' : ''}`}>
          {user?.profileImage && user.profileImage !== 'default.png' ? (
            <AvatarImage
              src={user.profileImage}
              alt={user.name}
            />
          ) : (
            <AvatarFallback className="bg-gray-100">
              <User className="w-10 h-10 text-gray-300" />
            </AvatarFallback>
          )}
        </Avatar>
        
        {/* 2. 닉네임 */}
        <h2 className={`text-lg font-bold text-gray-900 text-center ${user ? '' : 'mb-6'}`}>
          {user ? user.name : "로그인 필요"}
        </h2>

        {/* 3. 이메일 */}
        {user && (
          <p className="text-xs text-gray-500 mb-2 truncate max-w-full">{user.email}</p>
        )}

        {/* 4. 커뮤니티/역할 뱃지 */}
        {user && (
          <div className="flex gap-2 mb-6">
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
              {user.communityName}
            </span>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
              {user.role}
            </span>
          </div>
        )}

        {/* 5. 스탯 정보 */}
        <div className="w-full space-y-3 mb-6">
          <div className="flex justify-between items-center text-sm">
            <span className="flex items-center text-gray-500 gap-1.5 whitespace-nowrap">
              <FileText className="w-4 h-4 flex-shrink-0" />
              <span>내 게시글</span>
            </span>
            <span className="font-bold text-gray-900">{user?.stats?.posts ?? 0}</span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="flex items-center text-gray-500 gap-1.5 whitespace-nowrap">
              <MessageSquare className="w-4 h-4 flex-shrink-0" />
              <span>참여 채팅</span>
            </span>
            <span className="font-bold text-gray-900">{user?.stats?.participatingChats ?? 0}</span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="flex items-center text-gray-500 gap-1.5 whitespace-nowrap">
              <MessageCircle className="w-4 h-4 flex-shrink-0" />
              <span>내 댓글</span>
            </span>
            <span className="font-bold text-gray-900">{user?.stats?.comments ?? 0}</span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="flex items-center text-gray-500 gap-1.5 whitespace-nowrap">
              <Heart className="w-4 h-4 flex-shrink-0" />
              <span>좋아요</span>
            </span>
            <span className="font-bold text-gray-900">{user?.stats?.likes ?? 0}</span>
          </div>
        </div>

        {/* 6. 버튼 */}
        <Button 
          className="w-full font-bold h-11 text-sm shadow-sm bg-slate-900 hover:bg-slate-800 text-white transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            if (user) {
              handleWrite();
            } else {
              handleLogin();
            }
          }}  
        >
          {user ? (
            "글쓰기"
          ) : (
            <>
              <LogIn className="w-4 h-4 mr-2" /> 로그인/회원가입
            </>
          )}
        </Button>

      </CardContent>
    </Card>
  );
}
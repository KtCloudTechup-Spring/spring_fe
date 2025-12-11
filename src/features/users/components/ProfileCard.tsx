"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FileText, MessageCircle, Heart, User, LogIn, MessageSquare } from "lucide-react";

interface UserProps {
  user: {
    name: string;
    email: string;
    profileImage: string;
    stats: {
      posts: number;
      participatingChats: number;
      comments: number;
      likes: number;
    };
  } | null;
  currentCommunityId?: number;
}

export default function ProfileCard({ user, currentCommunityId }: UserProps) {
  const router = useRouter();

  // 로그인 페이지로 이동하는 함수
  const handleLogin = () => {
    console.log("로그인 페이지로 이동");
    router.push("/login");
  };

  // 글쓰기 페이지로 이동하는 함수
  const handleWrite = () => {
    if (currentCommunityId) {
      router.push(`/post?category=${currentCommunityId}`);
    } else {
      router.push("/post");
    }
  };

  return (
    <Card 
      onClick={() => user && router.push("/mypage")}
      className={`sticky top-24 shadow-sm border-gray-200 transition-colors group ${user ? 'cursor-pointer hover:border-slate-300' : ''}`}
    >
      <CardContent className="flex flex-col items-center pt-8 pb-6">
        
        {/* 1. 프로필 사진 (비로그인 시 회색 기본 아이콘) */}
        <Avatar className={`w-24 h-24 mb-4 ring-4 ring-gray-50 ${user ? 'group-hover:ring-slate-200 transition-all' : ''}`}>
          {user?.profileImage ? (
            <AvatarImage src={user.profileImage} />
          ) : (
            <AvatarFallback className="bg-gray-100">
              <User className="w-12 h-12 text-gray-300" />
            </AvatarFallback>
          )}
        </Avatar>
        
        {/* 2. 닉네임 (비로그인 시 '로그인 필요') */}
        <h2 className={`text-xl font-bold text-gray-900 ${user ? '' : 'mb-6'}`}>
          {user ? user.name : "로그인 필요"}
        </h2>

        {/* 3. 이메일 (로그인 했을 때만 보임 / 비로그인 시 문구 삭제됨) */}
        {user && (
          <p className="text-sm text-gray-500 mb-6">{user.email}</p>
        )}

        {/* 4. 스탯 정보 (비로그인 시 0으로 고정) */}
        <div className="w-full space-y-4 mb-8 px-2">
          <div className="flex justify-between items-center text-sm">
            <span className="flex items-center text-gray-500 gap-2">
              <FileText className="w-4 h-4" /> 내 게시글
            </span>
            <span className="font-bold text-gray-900">{user?.stats.posts ?? 0}</span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="flex items-center text-gray-500 gap-2">
              <MessageSquare className="w-4 h-4" /> 참여 중인 채팅
            </span>
            <span className="font-bold text-gray-900">{user?.stats.participatingChats ?? 0}</span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="flex items-center text-gray-500 gap-2">
              <MessageCircle className="w-4 h-4" /> 내 댓글
            </span>
            <span className="font-bold text-gray-900">{user?.stats.comments ?? 0}</span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="flex items-center text-gray-500 gap-2">
              <Heart className="w-4 h-4" /> 좋아요
            </span>
            <span className="font-bold text-gray-900">{user?.stats.likes ?? 0}</span>
          </div>
        </div>

        {/* 5. 버튼 (로그인/회원가입 vs 글쓰기) */}
        <Button 
          className="w-full font-bold h-12 text-sm shadow-sm bg-slate-900 hover:bg-slate-800 text-white transition-colors"
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
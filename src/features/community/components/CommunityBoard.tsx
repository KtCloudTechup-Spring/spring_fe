"use client";

import { useState } from "react";
import Link from "next/link"; 
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Users, ArrowRight, X, Send } from "lucide-react";
import PostCard from "@/features/posts/components/PostCard";

// 임시 데이터
const mockPosts = [
  {
    id: 1,
    tag: "질문",
    title: "Next.js 14에서 서버 액션 에러 질문입니다 ㅠㅠ",
    content:
      "서버 컴포넌트에서 클라이언트 컴포넌트로 props를 넘길 때 직렬화 에러가 자꾸 뜨는데 도저히 이유를 모르겠네요.",
    author: "코딩초보",
    date: "방금 전",
    likes: 2,
    comments: 4,
    badgeColor: "bg-red-100 text-red-600 hover:bg-red-100",
  },
  {
    id: 2,
    tag: "팁",
    title: "Tailwind CSS 쓰실 때 유용한 플러그인 추천",
    content:
      "클래스명이 너무 길어져서 가독성이 떨어질 때 'tailwind-merge'랑 'clsx' 조합해서 쓰면 진짜 편합니다.",
    author: "CSS장인",
    date: "10분 전",
    likes: 15,
    comments: 8,
    badgeColor: "bg-blue-100 text-blue-600 hover:bg-blue-100",
  },
  {
    id: 3,
    tag: "정보",
    title: "2024년 프론트엔드 로드맵 정리 공유합니다",
    content:
      "이번에 취업 준비하면서 정리한 로드맵입니다. React, Next.js, TS 중심으로 정리했고 필요하신 분들 참고하세요!",
    author: "취준생",
    date: "1시간 전",
    likes: 42,
    comments: 12,
    badgeColor: "bg-green-100 text-green-600 hover:bg-green-100",
  },
  {
    id: 4,
    tag: "잡담",
    title: "요즘 개발자 취업 시장 어떤가요?",
    content:
      "신입으로 지원하고 있는데 서류 통과율이 너무 낮네요... 포트폴리오를 갈아엎어야 할지 고민입니다.",
    author: "고민많음",
    date: "3시간 전",
    likes: 5,
    comments: 21,
    badgeColor: "bg-gray-100 text-gray-600 hover:bg-gray-100",
  },
];

interface CommunityBoardProps {
  communityName: string;
}

export function CommunityBoard({ communityName }: CommunityBoardProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[minmax(200px,auto)]">
      
      {/* ---------------- 채팅방 카드 ---------------- */}
      <Card
        className={`
          transition-all duration-300 ease-in-out border-slate-200 flex flex-col group overflow-hidden
          ${
            isChatOpen
              ? "col-span-2 row-span-2 ring-2 ring-slate-900 shadow-xl bg-white"
              : "col-span-1 row-span-1 hover:shadow-md cursor-pointer bg-slate-50"
          }
        `}
      >
        <CardHeader className="pb-3 flex flex-row justify-between items-start space-y-0">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Badge className="bg-red-500 hover:bg-red-600 border-none animate-pulse">
                LIVE
              </Badge>
              <span className="text-xs text-slate-600 font-bold flex items-center bg-white px-2 py-1 rounded-full shadow-sm border border-slate-100">
                <Users className="w-3 h-3 mr-1" /> 128명
              </span>
            </div>
            <CardTitle className="text-lg font-bold text-slate-900">
              {communityName} 오픈채팅
            </CardTitle>
          </div>

          {isChatOpen && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsChatOpen(false)}
              className="h-8 w-8 -mt-1 -mr-2"
            >
              <X className="w-4 h-4 text-slate-400 hover:text-slate-900" />
            </Button>
          )}
        </CardHeader>

        <CardContent className="flex-1 pb-3 flex flex-col">
          {isChatOpen ? (
            <div className="flex-1 flex flex-col justify-between animate-in fade-in duration-500">
              <div className="bg-slate-50 rounded-lg p-3 flex-1 mb-3 border border-slate-100 overflow-y-auto max-h-[300px]">
                <div className="space-y-4 text-sm">
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0" />
                    <div>
                      <span className="text-xs text-slate-500 block mb-1">
                        익명123
                      </span>
                      <div className="bg-white p-2 rounded-r-lg rounded-bl-lg shadow-sm text-slate-700 border border-slate-200">
                        안녕하세요! 혹시 {communityName} 관련해서 질문해도
                        될까요?
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-row-reverse">
                    <div className="w-8 h-8 rounded-full bg-slate-900 shrink-0" />
                    <div className="text-right">
                      <span className="text-xs text-slate-500 block mb-1">
                        나
                      </span>
                      <div className="bg-slate-900 p-2 rounded-l-lg rounded-br-lg shadow-sm text-white">
                        네 안녕하세요! 어떤 게 궁금하신가요?
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-center text-slate-400 my-2">
                    -- 실시간 대화 참여 중 --
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder="메시지를 입력하세요..."
                  className="bg-white focus-visible:ring-slate-900"
                />
                <Button
                  size="icon"
                  className="bg-slate-900 hover:bg-slate-800 shrink-0"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-500 leading-relaxed">
              지금 들어와서 현직자들과 실시간으로 대화를 나눠보세요!
            </p>
          )}
        </CardContent>

        {!isChatOpen && (
          <CardFooter className="pt-0 pb-4 mt-auto">
            <Button
              onClick={() => setIsChatOpen(true)}
              className="w-full bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 font-bold shadow-sm group-hover:border-slate-900 transition-colors"
            >
              입장하기 <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </CardFooter>
        )}
      </Card>
      
      {/* ---------------- 게시글 목록 ---------------- */}
      {mockPosts.map((post) => (
        <Link key={post.id} href={`/community/${post.id}`} className="block h-full group">
          <PostCard post={post} />
        </Link>
      ))}
    </div>
  );
}
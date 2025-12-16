"use client";

import { useState, useEffect } from "react";
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

// 게시글 타입 정의
interface Post {
  id: number;
  tag?: string;
  title: string;
  content: string;
  author: string;
  date: string;
  likes: number;
  comments: number;
  badgeColor?: string;
}

interface CommunityBoardProps {
  communityName: string;
  communityId: number;
}

export function CommunityBoard({ communityName, communityId }: CommunityBoardProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 게시글 목록 불러오기
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("accessToken");

        // ========== 디버깅 정보 출력 ==========
        console.log("========== 게시글 요청 시작 ==========");
        console.log("communityId:", communityId);
        console.log("토큰 존재:", !!token);
        console.log("토큰:", token);

        // 방법 1: 기본 fetch (현재 방식)
        console.log("\n[시도 1] 기본 fetch with Authorization header");
        const requestUrl = `/api/posts?courseId=${communityId}`;
        console.log("URL:", requestUrl);

        const response = await fetch(requestUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          credentials: "include", // 쿠키 포함
        });

        console.log("\n========== 응답 정보 ==========");
        console.log("상태 코드:", response.status);
        console.log("상태 텍스트:", response.statusText);
        console.log("응답 헤더:", Object.fromEntries(response.headers.entries()));

        if (response.ok) {
          const data = await response.json();
          console.log("✅ 성공! 응답 데이터:", data);
          const postList = data.list || [];
          setPosts(postList);
        } else {
          // 에러 응답을 한 번만 읽기
          const responseText = await response.text();

          console.error("\n========== 상세 에러 정보 ==========");
          console.error("상태:", response.status);
          console.error("에러 응답:", responseText);
          console.error("요청 URL:", requestUrl);
          console.error("사용된 토큰:", token);
          console.error("===================================");

          // 403 에러인 경우 토큰 없이 재시도
          if (response.status === 403) {
            console.log("\n[시도 2] 토큰 없이 재시도...");
            const retryResponse = await fetch(requestUrl, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            });

            console.log("토큰 없이 요청 결과:", retryResponse.status);

            if (retryResponse.ok) {
              const data = await retryResponse.json();
              console.log("✅ 토큰 없이 성공!", data);
              const postList = data.list || [];
              setPosts(postList);
            } else {
              const errorText = await retryResponse.text();
              console.error("❌ 토큰 없이도 실패:", retryResponse.status, errorText);
            }
          }
        }
      } catch (error) {
        console.error("❌ 예외 발생:", error);
        console.error("에러 상세:", JSON.stringify(error, null, 2));
      } finally {
        setIsLoading(false);
        console.log("========== 요청 종료 ==========\n");
      }
    };

    fetchPosts();
  }, [communityId]);

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
      {isLoading ? (
        <div className="col-span-2 flex items-center justify-center py-10">
          <p className="text-slate-400">게시글을 불러오는 중...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="col-span-2 flex items-center justify-center py-10">
          <p className="text-slate-400">아직 게시글이 없습니다.</p>
        </div>
      ) : (
        posts.map((post) => (
          <Link key={post.id} href={`/community/${post.id}`} className="block h-full group">
            <PostCard post={post} />
          </Link>
        ))
      )}
    </div>
  );
}
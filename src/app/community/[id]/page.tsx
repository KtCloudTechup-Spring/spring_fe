"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { 
  MessageCircle, 
  ThumbsUp, 
  User, 
  ArrowLeft, 
  Share2, 
  Send,
  Heart
} from "lucide-react";
import Link from "next/link";

export default function PostDetailPage() {
  const params = useParams();
  const postId = params.id;

  const [likes, setLikes] = useState(42);
  const [isLiked, setIsLiked] = useState(false);
  const [comment, setComment] = useState("");
  
  const post = {
    title: "게시글 상세 페이지입니다",
    content: `
      현재 보고 계신 글의 ID는 ${postId}번 입니다.
      
      본문 내용이 길어지면 박스도 자동으로 길어집니다.

      하나
      둘
      셋
      
      이렇게 내용에 맞게 유동적으로 변합니다.
      스크롤 없이 내용 전체가 쭉 늘어나는 구조입니다.
    `,
    author: "테크업",
    date: "2025.12.11 15:00",
    category: "공지",
    views: 128,
  };

  // --- [기능 핸들러] 백엔드 연결 시 여기만 수정하면 됩니다 ---

  const handleLike = () => {
    // 백엔드 전송 로직이 들어갈 자리
    // await fetch('/api/like', { method: 'POST' ... })
    if (isLiked) {
      setLikes(likes - 1);
      setIsLiked(false);
    } else {
      setLikes(likes + 1);
      setIsLiked(true);
    }
  };

  const handleShareToChat = () => {
    // 채팅방 공유 로직이 들어갈 자리
    alert(`📢 [핵심 기능] 게시글 ${postId}번을 채팅방으로 공유합니다!`);
  };

  const handleSubmitComment = () => {
    if (!comment.trim()) return;
    // 댓글 전송 로직이 들어갈 자리
    console.log("댓글 전송:", comment);
    setComment(""); // 입력창 비우기
    alert("댓글이 등록되었습니다.");
  };

  // -----------------------------------------------------

  return (
    <main className="max-w-[1000px] mx-auto pt-8 px-4 pb-20">
      
      {/* 1. 네비게이션 */}
      <div className="mb-6">
        <Link href="/community">
          <Button variant="ghost" className="pl-0 hover:bg-transparent hover:text-slate-600">
            <ArrowLeft className="w-5 h-5 mr-2" />
            게시판으로 돌아가기
          </Button>
        </Link>
      </div>

      {/* 2. 게시글 카드 */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-8">
        
        {/* 헤더 */}
        <div className="p-6 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="secondary" className="bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-100">
              {post.category}
            </Badge>
            <span className="text-xs text-slate-400">조회 {post.views}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6 leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-slate-100">
              <AvatarFallback className="bg-slate-100"><User className="h-5 w-5 text-slate-400" /></AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold text-slate-900 text-sm">{post.author}</div>
              <div className="text-xs text-slate-500">{post.date}</div>
            </div>
          </div>
        </div>

        {/* 본문 (높이 유동적) */}
        <div className="p-6 text-slate-800 whitespace-pre-line leading-relaxed min-h-[100px]">
          {post.content}
        </div>

        {/* 인터랙션 섹션 (좋아요/공유) */}
        <div className="p-6 bg-slate-50/50 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex gap-3">
              <Button 
                onClick={handleLike}
                variant={isLiked ? "default" : "outline"} 
                className={`gap-2 ${isLiked ? "bg-red-500 hover:bg-red-600 text-white border-red-500" : "text-slate-600 bg-white"}`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
                {likes}
              </Button>
            </div>

            {/* [핵심 기능] 공유하기 버튼 */}
            <Button 
              onClick={handleShareToChat}
              className="bg-slate-900 hover:bg-slate-800 text-white gap-2 shadow-sm font-bold"
            >
              <Share2 className="w-4 h-4" />
              채팅방에 공유하기
            </Button>
          </div>
        </div>
      </div>

      {/* 3. 댓글 섹션 */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          댓글 작성
        </h3>
        
        <div className="flex gap-4 items-start">
          <Avatar className="w-8 h-8 mt-1">
            <AvatarFallback>나</AvatarFallback>
          </Avatar>
          <div className="flex-1 gap-2 flex flex-col sm:flex-row">
            <Textarea 
              placeholder="매너 있는 댓글을 남겨주세요." 
              className="min-h-[80px] bg-white resize-y focus-visible:ring-slate-900"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <Button 
              onClick={handleSubmitComment}
              className="h-[80px] w-20 bg-slate-900 hover:bg-slate-800 hidden sm:flex flex-col gap-1"
            >
              <Send className="w-4 h-4" />
              <span className="text-xs">등록</span>
            </Button>
            {/* 모바일용 버튼 */}
            <Button onClick={handleSubmitComment} className="w-full sm:hidden bg-slate-900">
              등록
            </Button>
          </div>
        </div>
      </div>

    </main>
  );
}
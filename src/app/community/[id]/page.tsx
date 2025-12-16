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

interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  date: string;
  category?: string;
  views?: number;
  likes: number;
  isLiked?: boolean;
}

interface Comment {
  id: number;
  content: string;
  author: string;
  createdAt: string;
  isAuthor?: boolean;
}

export default function PostDetailPage() {
  const params = useParams();
  const postId = params.id;

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [comment, setComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");

  // 게시글 상세 조회
  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/posts/${postId}`);
        if (response.ok) {
          const data = await response.json();
          setPost(data.post);
          setIsLiked(data.post.isLiked || false);
          // 댓글 목록도 함께 설정 (API 응답에 comments가 포함되어 있다고 가정)
          if (data.comments) {
            setComments(data.comments);
          }
        } else {
          console.error("게시글 조회 실패:", response.status);
        }
      } catch (error) {
        console.error("게시글 조회 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId]);

  // 댓글 목록 새로고침
  const refreshComments = async () => {
    try {
      const response = await fetch(`/api/posts/${postId}/comments`);
      if (response.ok) {
        const data = await response.json();
        setComments(data.comments || []);
      }
    } catch (error) {
      console.error("댓글 조회 실패:", error);
    }
  };

  // --- [기능 핸들러] ---

  const handleLike = async () => {
    if (!post) return;

    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setIsLiked(data.liked);
        // 게시글 정보 다시 불러오기 (좋아요 수 업데이트)
        const postResponse = await fetch(`/api/posts/${postId}`);
        if (postResponse.ok) {
          const postData = await postResponse.json();
          setPost(postData.post);
        }
      }
    } catch (error) {
      console.error("좋아요 처리 실패:", error);
      alert("로그인이 필요합니다.");
    }
  };

  const handleShareToChat = () => {
    // 채팅방 공유 로직이 들어갈 자리
    alert(`📢 [핵심 기능] 게시글 ${postId}번을 채팅방으로 공유합니다!`);
  };

  const handleSubmitComment = async () => {
    if (!comment.trim()) return;

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("로그인이 필요합니다.");
        return;
      }

      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: comment }),
      });

      if (response.ok) {
        setComment("");
        await refreshComments();
        alert("댓글이 등록되었습니다.");
      } else {
        alert("댓글 등록에 실패했습니다.");
      }
    } catch (error) {
      console.error("댓글 등록 실패:", error);
      alert("댓글 등록에 실패했습니다.");
    }
  };

  const handleEditComment = async (commentId: number) => {
    if (!editContent.trim()) return;

    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`/api/comments/${commentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: editContent }),
      });

      if (response.ok) {
        setEditingCommentId(null);
        setEditContent("");
        await refreshComments();
        alert("댓글이 수정되었습니다.");
      } else {
        alert("댓글 수정에 실패했습니다.");
      }
    } catch (error) {
      console.error("댓글 수정 실패:", error);
      alert("댓글 수정에 실패했습니다.");
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!confirm("댓글을 삭제하시겠습니까?")) return;

    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        await refreshComments();
        alert("댓글이 삭제되었습니다.");
      } else {
        alert("댓글 삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error("댓글 삭제 실패:", error);
      alert("댓글 삭제에 실패했습니다.");
    }
  };

  // -----------------------------------------------------

  if (isLoading) {
    return (
      <main className="max-w-[1000px] mx-auto pt-8 px-4 pb-20">
        <div className="flex items-center justify-center py-20">
          <p className="text-slate-400">게시글을 불러오는 중...</p>
        </div>
      </main>
    );
  }

  if (!post) {
    return (
      <main className="max-w-[1000px] mx-auto pt-8 px-4 pb-20">
        <div className="flex items-center justify-center py-20">
          <p className="text-slate-400">게시글을 찾을 수 없습니다.</p>
        </div>
      </main>
    );
  }

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
              {post.category || "일반"}
            </Badge>
            <span className="text-xs text-slate-400">조회 {post.views || 0}</span>
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
                {post.likes}
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
          댓글 {comments.length > 0 && `(${comments.length})`}
        </h3>

        {/* 댓글 목록 */}
        {comments.length > 0 && (
          <div className="mb-6 space-y-4">
            {comments.map((commentItem) => (
              <div key={commentItem.id} className="flex gap-3 p-4 bg-slate-50 rounded-lg">
                <Avatar className="w-8 h-8 mt-1">
                  <AvatarFallback>{commentItem.author[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="font-semibold text-sm text-slate-900">
                        {commentItem.author}
                      </span>
                      <span className="text-xs text-slate-400 ml-2">
                        {commentItem.createdAt}
                      </span>
                    </div>
                    {commentItem.isAuthor && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setEditingCommentId(commentItem.id);
                            setEditContent(commentItem.content);
                          }}
                          className="text-xs text-slate-500 hover:text-slate-900"
                        >
                          수정
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteComment(commentItem.id)}
                          className="text-xs text-red-500 hover:text-red-700"
                        >
                          삭제
                        </Button>
                      </div>
                    )}
                  </div>
                  {editingCommentId === commentItem.id ? (
                    <div className="flex gap-2">
                      <Textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="min-h-[60px] bg-white"
                      />
                      <div className="flex flex-col gap-1">
                        <Button
                          size="sm"
                          onClick={() => handleEditComment(commentItem.id)}
                          className="bg-slate-900"
                        >
                          완료
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingCommentId(null);
                            setEditContent("");
                          }}
                        >
                          취소
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-700 whitespace-pre-line">
                      {commentItem.content}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 댓글 작성 */}
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
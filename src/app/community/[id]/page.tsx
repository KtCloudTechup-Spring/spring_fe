"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  MessageCircle,
  User,
  ArrowLeft,
  Share2,
  Heart
} from "lucide-react";
import Link from "next/link";
import { getPostById, toggleFavorite } from "@/lib/api/posts";
import {
  getComments,
  createComment,
  updateComment,
  deleteComment,
} from "@/lib/api/comments";
import { ShareToChatModal } from "@/components/ShareToChatModal";

interface Post {
  id: number;
  title: string;
  content: string;
  imageUrl?: string;
  author: string;
  authorProfileImage: string;
  date: string;
  likes: number;
  isLiked: boolean;
  commentCount: number;
  communityId?: number;
}

interface Comment {
  id: number;
  postId: number;
  userId: number;
  content: string;
  author: string;
  authorProfileImage: string;
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
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const getCommunityName = (communityId?: number) => {
    if (!communityId) return null;
    const communities: { [key: number]: string } = {
      1: "풀스택",
      2: "프론트엔드",
      3: "백엔드",
      4: "생성형 AI",
      5: "사이버 보안",
      6: "클라우드 인프라",
      7: "클라우드 네이티브",
      8: "프로덕트 디자인",
      9: "프로덕트 매니지먼트",
    };
    return communities[communityId] || `커뮤니티 ${communityId}`;
  };

  // 게시글 상세 조회
  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);
      try {
        const response = await getPostById(postId as string);

        console.log('API Response:', response);

        // API 응답 데이터를 Post 인터페이스에 맞게 매핑
        const mappedPost: Post = {
          id: response.data.id,
          title: response.data.title,
          content: response.data.content,
          imageUrl: response.data.imageUrl,
          author: response.data.authorName,
          authorProfileImage: response.data.authorProfileImage,
          date: new Date(response.data.createdAt).toLocaleDateString('ko-KR'),
          likes: response.data.favoriteCount,
          isLiked: response.data.favorited,
          commentCount: response.data.commentCnt,
          communityId: response.data.communityId,
        };

        console.log('Mapped Post:', mappedPost);

        setPost(mappedPost);
        setIsLiked(response.data.favorited);
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

  // 댓글 목록 조회
  useEffect(() => {
    const fetchComments = async () => {
      if (!postId) return;

      try {
        const response = await getComments(postId as string);

        // 현재 로그인한 사용자 정보 가져오기
        const currentUserStr = localStorage.getItem("user");
        const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;
        const currentUserId = currentUser?.id;

        // API 응답을 Comment 인터페이스에 맞게 매핑
        const mappedComments: Comment[] = response.data.content.map((comment) => ({
          id: comment.id,
          postId: comment.postId,
          userId: comment.userId,
          content: comment.content,
          author: comment.authorName,
          authorProfileImage: comment.authorProfileImage,
          createdAt: new Date(comment.createdAt).toLocaleString('ko-KR'),
          isAuthor: currentUserId === comment.userId,
        }));

        setComments(mappedComments);
      } catch (error) {
        console.error("댓글 조회 실패:", error);
      }
    };

    if (postId) {
      fetchComments();
    }
  }, [postId]);

  // 댓글 목록 새로고침
  const refreshComments = async () => {
    try {
      const response = await getComments(postId as string);

      const currentUserStr = localStorage.getItem("user");
      const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;
      const currentUserId = currentUser?.id;

      const mappedComments: Comment[] = response.data.content.map((comment) => ({
        id: comment.id,
        postId: comment.postId,
        userId: comment.userId,
        content: comment.content,
        author: comment.authorName,
        authorProfileImage: comment.authorProfileImage,
        createdAt: new Date(comment.createdAt).toLocaleString('ko-KR'),
        isAuthor: currentUserId === comment.userId,
      }));

      setComments(mappedComments);
    } catch (error) {
      console.error("댓글 조회 실패:", error);
    }
  };

  // --- [기능 핸들러] ---

  const handleLike = async () => {
    if (!post) return;

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("로그인이 필요합니다.");
        return;
      }

      const response = await toggleFavorite(postId as string);

      // 좋아요 상태와 개수 업데이트
      setIsLiked(response.data.favorited);
      setPost({
        ...post,
        likes: response.data.favoriteCount,
        isLiked: response.data.favorited,
      });
    } catch (error) {
      console.error("좋아요 처리 실패:", error);
      alert("좋아요 처리에 실패했습니다.");
    }
  };

  const handleShareToChat = () => {
    setIsShareModalOpen(true);
  };

  const handleSubmitComment = async () => {
    if (!comment.trim()) return;

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("로그인이 필요합니다.");
        return;
      }

      await createComment(postId as string, { content: comment });
      setComment("");
      await refreshComments();
    } catch (error) {
      console.error("댓글 등록 실패:", error);
      alert("댓글 등록에 실패했습니다.");
    }
  };

  const handleEditComment = async (commentId: number) => {
    if (!editContent.trim()) return;

    try {
      await updateComment(postId as string, commentId, { content: editContent });
      setEditingCommentId(null);
      setEditContent("");
      await refreshComments();
    } catch (error) {
      console.error("댓글 수정 실패:", error);
      alert("댓글 수정에 실패했습니다.");
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!confirm("댓글을 삭제하시겠습니까?")) return;

    try {
      await deleteComment(postId as string, commentId);
      await refreshComments();
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
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight mb-5">
            {post.title}
          </h1>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Avatar className="h-8 w-8 border border-slate-100">
                <AvatarImage src={post.authorProfileImage} />
                <AvatarFallback className="bg-slate-100">
                  <User className="h-4 w-4 text-slate-400" />
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium text-slate-900 text-xs">{post.author}</div>
                <div className="text-[11px] text-slate-500">{post.date}</div>
              </div>
            </div>
            {post.communityId && (
              <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full whitespace-nowrap">
                {getCommunityName(post.communityId)}
              </span>
            )}
          </div>
        </div>

        {/* 본문 (높이 유동적) */}
        <div className="p-6 text-slate-800 whitespace-pre-line leading-relaxed min-h-[100px]">
          {post.content}
        </div>

        {/* 이미지 (있을 경우만 표시) */}
        {post.imageUrl && (
          <div className="px-6 pb-6">
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full max-w-2xl mx-auto rounded-lg border border-slate-200"
            />
          </div>
        )}

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
          댓글 {post.commentCount > 0 && `(${post.commentCount})`}
        </h3>

        {/* 댓글 목록 */}
        {comments.length > 0 && (
          <div className="mb-6 space-y-4">
            {comments.map((commentItem) => (
              <div key={commentItem.id} className="flex gap-3 p-4 bg-slate-50 rounded-lg">
                <Avatar className="w-8 h-8 mt-1">
                  <AvatarImage src={commentItem.authorProfileImage} />
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
        <div className="flex gap-3 items-center">
          <Avatar className="w-8 h-8">
            <AvatarFallback>나</AvatarFallback>
          </Avatar>
          <div className="flex-1 flex gap-2 items-center">
            <Textarea
              placeholder="매너 있는 댓글을 남겨주세요."
              className="min-h-[44px] max-h-[120px] bg-white resize-none focus-visible:ring-slate-900 py-3"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <Button
              onClick={handleSubmitComment}
              className="h-[44px] px-5 bg-slate-900 hover:bg-slate-800 shrink-0"
            >
              등록
            </Button>
          </div>
        </div>
      </div>

      {/* 채팅방 공유 모달 */}
      <ShareToChatModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        postId={post.id}
        postTitle={post.title}
        defaultCommunityId={post.communityId}
      />

    </main>
  );
}
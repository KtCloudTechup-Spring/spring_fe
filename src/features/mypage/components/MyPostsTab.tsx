"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { PagePostResponse } from "@/types/mypage";

export default function MyPostsTab() {
  const router = useRouter();
  const [posts, setPosts] = useState<PagePostResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    fetchMyPosts(currentPage);
  }, [currentPage]);

  const fetchMyPosts = async (page: number) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`/api/profile/my-posts?page=${page}&size=10`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        if (data && data.data) {
          setPosts(data.data);
        } else if (data) {
          setPosts(data);
        }
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePostClick = (postId: number) => {
    router.push(`/community/${postId}`);
  };

  const getCommunityName = (communityId: number) => {
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-400">로딩 중...</p>
      </div>
    );
  }

  if (!posts || posts.empty || !posts.content || posts.content.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center text-gray-500">
            <p>작성한 글이 없습니다.</p>
            <p className="text-sm mt-2">첫 글을 작성해보세요!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* 게시글 리스트 */}
      {posts.content && posts.content.map((post) => (
        <Card
          key={post.id}
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => handlePostClick(post.id)}
        >
          <CardContent className="p-6">
            <div className="space-y-3">
              {/* 제목과 커뮤니티 뱃지 */}
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-lg font-semibold text-gray-900 hover:text-slate-700 flex-1">
                  {post.title}
                </h3>
                {/* 커뮤니티 뱃지 */}
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full whitespace-nowrap">
                  {getCommunityName(post.communityId)}
                </span>
              </div>

              {/* 내용 미리보기 */}
              <p className="text-gray-600 text-sm line-clamp-2">
                {post.content}
              </p>

              {/* 메타 정보 */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <span className="text-sm text-gray-500">
                  {formatDate(post.createdAt)}
                </span>

                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    <span>{post.favoriteCount ?? 0}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    <span>{post.commentCount ?? 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* 페이지네이션 */}
      {posts.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
            disabled={posts.first}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <span className="text-sm text-gray-600">
            {currentPage + 1} / {posts.totalPages}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.min(posts.totalPages - 1, prev + 1))}
            disabled={posts.last}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

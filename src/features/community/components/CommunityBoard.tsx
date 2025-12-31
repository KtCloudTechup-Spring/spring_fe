"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import CommunityPostCard from "@/features/posts/components/CommunityPostCard";
import CommunityChatRoom from "@/features/community/components/CommunityChatRoom";

// 게시글 타입 정의
interface Post {
  id: number;
  tag?: string;
  title: string;
  content: string;
  imageUrl?: string;
  author: string;
  date: string;
  likes: number;
  comments: number;
  badgeColor?: string;
}

// API 응답 게시글 타입
interface ApiPost {
  id: number;
  postTitle?: string;
  title?: string;
  content: string;
  imageUrl?: string;
  authorName: string;
  createdAt: string;
  favorited: boolean;
  commentCount: number;
}

interface CommunityBoardProps {
  communityName: string;
  communityId: number;
}

export function CommunityBoard({
  communityName,
  communityId,
}: CommunityBoardProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 게시글 목록 불러오기
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("accessToken");
        const requestUrl = `/api/posts/community/${communityId}`;

        const response = await fetch(requestUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        if (response.ok) {
          const result = await response.json();
          const postList = result.data?.content || [];

          // API 응답 필드를 컴포넌트가 요구하는 Post 인터페이스로 매핑
          const mappedPosts: Post[] = postList.map((item: ApiPost) => {
            console.log("API 응답 데이터:", item);
            return {
              id: item.id,
              title: item.postTitle || item.title || "제목 없음",
              content: item.content,
              imageUrl: item.imageUrl,
              author: item.authorName,
              date: item.createdAt,
              likes: item.favorited ? 1 : 0,
              comments: item.commentCount,
            };
          });

          setPosts(mappedPosts);
        }
      } catch {
        // 에러 발생시 빈 배열 유지
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [communityId]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[minmax(200px,auto)]">
      {/* 채팅방 카드 */}
      <CommunityChatRoom
        communityName={communityName}
        communityId={communityId}
      />

      {/* 게시글 목록 */}
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
          <Link
            key={post.id}
            href={`/community/${post.id}`}
            className="block h-full group"
          >
            <CommunityPostCard post={post} />
          </Link>
        ))
      )}
    </div>
  );
}

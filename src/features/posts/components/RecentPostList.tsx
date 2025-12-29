"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Heart, MessageSquare } from "lucide-react";

// 데이터 타입 정의
interface Post {
  id: number;
  title: string;
  desc: string;
  author: string;
  date: string;
  likes: number;
  comments: number;
}

export default function RecentPostList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecentPosts = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("accessToken");
        const communityIds = [1, 2, 3, 4, 5, 6, 7, 8, 9];

        // 모든 커뮤니티의 게시글을 병렬로 가져오기
        const fetchPromises = communityIds.map((id) =>
          fetch(`/api/posts/community/${id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              ...(token && { Authorization: `Bearer ${token}` }),
            },
          })
            .then((res) => (res.ok ? res.json() : null))
            .catch(() => null)
        );

        const responses = await Promise.all(fetchPromises);

        // 모든 게시글을 하나의 배열로 합치기
        const allPosts = responses
          .filter((res) => res && res.data?.content)
          .flatMap((res) => res.data.content);

        // 최신순 정렬 후 3개만 추출
        const sortedPosts = allPosts
          .sort((a: any, b: any) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return dateB - dateA;
          })
          .slice(0, 3);

        // UI에 맞게 데이터 변환
        const recentPosts = sortedPosts.map((item: any) => ({
          id: item.id,
          title: item.postTitle || item.title || "제목 없음",
          desc: item.content || "",
          author: item.authorName || "익명",
          date: new Date(item.createdAt).toLocaleDateString("ko-KR"),
          likes: item.favoriteCount || 0,
          comments: item.commentCount || 0,
        }));

        setPosts(recentPosts);
      } catch (error) {
        console.error("최근 게시글 조회 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentPosts();
  }, []);

  if (isLoading) {
    return (
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-4">최근 게시물</h3>
        <div className="flex items-center justify-center py-10">
          <p className="text-gray-400">게시글을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-4">최근 게시물</h3>
        <div className="flex items-center justify-center py-10">
          <p className="text-gray-400">아직 게시글이 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-bold text-gray-800 mb-4">
        최근 게시물
      </h3>

      <div className="space-y-4">
        {posts.map((post) => (
          <Link key={post.id} href={`/community/${post.id}`}>
            <Card className="overflow-hidden hover:border-slate-900 hover:shadow-md transition-all cursor-pointer border-gray-200 group bg-white">
              {/* 내용 */}
              <div className="flex flex-col justify-center p-6 w-full">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-slate-900 transition-colors">
                  {post.title}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">
                  {post.desc}
                </p>

                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span className="text-gray-700 font-medium">{post.author}</span>
                  <span>·</span>
                  <span>{post.date}</span>
                  <div className="flex gap-2 ml-auto sm:ml-2">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3" /> {post.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" /> {post.comments}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

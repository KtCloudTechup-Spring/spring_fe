import {
  Card,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Heart } from "lucide-react";

interface CommunityPostCardProps {
  post: {
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
  };
}

export default function CommunityPostCard({ post }: CommunityPostCardProps) {
  // 날짜를 "YYYY년 M월 D일" 형식으로 변환
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer border-slate-200 overflow-hidden bg-white group pt-4 pb-2 h-full flex flex-col">
      {/* 썸네일 이미지 */}
      {post.imageUrl && (
        <div className="w-full h-40 bg-slate-100 overflow-hidden shrink-0">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        </div>
      )}

      <div className="flex-1 flex flex-col">
        <CardHeader className="px-6 pt-4 pb-3 flex-1">
          {/* 제목 */}
          <CardTitle className="text-base font-bold text-slate-900 line-clamp-2 group-hover:text-slate-700 transition-colors mb-2 leading-snug">
            {post.title}
          </CardTitle>

          {/* 본문 미리보기 */}
          <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
            {post.content}
          </p>
        </CardHeader>

        <CardFooter className="px-6 pb-2 pt-4 border-t border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-slate-400">
              {formatDate(post.date)} · {post.comments}개의 댓글
            </span>
            <span className="text-sm text-slate-700 font-medium">by {post.author}</span>
          </div>

          <span className="flex items-center gap-1.5 text-slate-500 hover:text-red-500 transition-colors">
            <Heart className="w-4 h-4" />
            <span className="text-sm font-medium">{post.likes}</span>
          </span>
        </CardFooter>
      </div>
    </Card>
  );
}

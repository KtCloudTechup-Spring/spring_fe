import {
  Card,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Heart } from "lucide-react";

// Post 데이터 타입 정의 (나중에 types.ts로 뺄 수도 있음)
interface PostProps {
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

export default function PostCard({ post }: PostProps) {
  // 날짜를 "YYYY년 M월 D일 · 0개의 댓글" 형식으로 변환
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer border-0 overflow-hidden bg-white group !h-[350px] !p-0">
      <div className="h-full flex flex-col">
        <CardHeader className="px-8 pt-4 pb-2 flex-1 flex flex-col">
          {/* 제목 */}
          <CardTitle className="text-lg font-bold text-slate-900 line-clamp-1 group-hover:text-slate-700 transition-colors mb-3">
            {post.title}
          </CardTitle>

          {/* 본문 미리보기 */}
          <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed mb-3">
            {post.content}
          </p>

          {/* 썸네일 이미지 (항상 공간 유지) */}
          <div className="w-full h-20 bg-slate-50 rounded-lg border border-slate-200 overflow-hidden flex items-center justify-center mb-4 shrink-0">
            {post.imageUrl ? (
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="invisible">placeholder</div>
            )}
          </div>
        </CardHeader>

        <CardFooter className="flex flex-col items-stretch px-8 py-0 border-t border-slate-100 gap-2 shrink-0">
          {/* 날짜 */}
          <div className="text-xs text-slate-400 pt-2.5">
            {formatDate(post.date)} · {post.comments}개의 댓글
          </div>

          {/* 작성자와 좋아요 */}
          <div className="flex items-center justify-between pb-2.5">
            <span className="text-sm text-slate-600">by {post.author}</span>
            <span className="flex items-center gap-1.5 text-slate-500 hover:text-red-500 transition-colors text-sm">
              <Heart className="w-4 h-4" /> {post.likes}
            </span>
          </div>
        </CardFooter>
      </div>
    </Card>
  );
}

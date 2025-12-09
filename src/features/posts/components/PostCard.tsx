import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Heart, User, Clock } from "lucide-react";

// Post 데이터 타입 정의 (나중에 types.ts로 뺄 수도 있음)
interface PostProps {
  post: {
    id: number;
    tag: string;
    title: string;
    content: string;
    author: string;
    date: string;
    likes: number;
    comments: number;
    badgeColor?: string;
  };
}

export default function PostCard({ post }: PostProps) {
  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer border-slate-200 flex flex-col h-full bg-white group">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-2">
          <Badge className={`${post.badgeColor || "bg-slate-100 text-slate-600"} border-none`}>
            {post.tag}
          </Badge>
          <span className="text-xs text-slate-400 flex items-center">
            <Clock className="w-3 h-3 mr-1" /> {post.date}
          </span>
        </div>
        <CardTitle className="text-lg font-bold line-clamp-1 group-hover:text-slate-700 transition-colors">
          {post.title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 pb-3">
        <p className="text-sm text-slate-500 line-clamp-3 leading-relaxed">
          {post.content}
        </p>
      </CardContent>

      <CardFooter className="pt-0 pb-4 text-slate-500 text-xs border-t border-slate-50 mt-auto pt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <User className="w-3 h-3 text-slate-400" />
          <span className="font-medium text-slate-700">{post.author}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 hover:text-red-500 transition-colors">
            <Heart className="w-3.5 h-3.5" /> {post.likes}
          </span>
          <span className="flex items-center gap-1 hover:text-blue-500 transition-colors">
            <MessageCircle className="w-3.5 h-3.5" /> {post.comments}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
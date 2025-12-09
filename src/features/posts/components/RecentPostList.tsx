import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

export default function RecentPostList({ posts }: { posts: Post[] }) {
  return (
    <div>
      <h3 className="text-lg font-bold text-gray-800 mb-4">
        최근 게시글 <span className="text-sm font-normal text-teal-600 ml-1">{posts.length}개의 게시글</span>
      </h3>
      
      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post.id} className="flex flex-col sm:flex-row overflow-hidden hover:border-teal-500 hover:shadow-md transition-all cursor-pointer border-gray-200 group bg-white">
            
            {/* 왼쪽 썸네일 */}
            <div className="sm:w-48 h-32 sm:h-auto bg-gray-100 shrink-0 relative flex items-center justify-center text-gray-300">
               <span>썸네일</span>
            </div>

            {/* 오른쪽 내용 */}
            <div className="flex flex-col justify-center p-6 w-full">
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors">
                {post.title}
              </h3>
              <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">
                {post.desc}
              </p>
              
              <div className="flex items-center gap-3 text-xs text-gray-400">
                 <Avatar className="w-5 h-5">
                    <AvatarImage src="https://github.com/shadcn.png" />
                 </Avatar>
                 <span className="text-gray-700 font-medium">{post.author}</span>
                 <span>·</span>
                 <span>{post.date}</span>
                 <div className="flex gap-2 ml-auto sm:ml-2">
                    <span className="flex items-center gap-1"><Heart className="w-3 h-3"/> {post.likes}</span>
                    <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3"/> {post.comments}</span>
                 </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
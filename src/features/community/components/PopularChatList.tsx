import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, ArrowRight, Flame } from "lucide-react";

// 채팅방 데이터 타입 정의
interface ChatRoom {
  id: number;
  rank: number;
  category: string; // 풀스택, AI
  title: string;    // 방 제목
  lastMessage: string; // 최근 올라온 대화
  activeUsers: number; // 현재 접속자 수
  bgColor: string;     // 배경 포인트 색상
  rankColor: string;   // 순위 뱃지 색상
}

export default function PopularChatList({ chatRooms }: { chatRooms: ChatRoom[] }) {
  return (
    <div>
      {/* 섹션 제목 */}
      <div className="flex items-center gap-2 mb-4">
        <Flame className="w-5 h-5 text-orange-500 animate-pulse" />
        <h3 className="text-lg font-bold text-gray-800">
          지금 가장 핫한 채팅방 <span className="text-slate-400 font-normal text-sm ml-1">실시간 소통 중!</span>
        </h3>
      </div>

      {/* 카드 3개 그리드 배치 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {chatRooms.map((room) => (
          <Card key={room.id} className="overflow-hidden hover:shadow-lg transition-all border-gray-200 group h-full flex flex-col hover:-translate-y-1 duration-300">
            
            {/* 상단: 카테고리 & 순위 영역 */}
            <div className={`h-24 ${room.bgColor} relative p-4 flex flex-col justify-between`}>
              <div className="flex justify-between items-start">
                <Badge className={`${room.rankColor} hover:${room.rankColor} text-white border-none shadow-sm px-2 py-0.5`}>
                  {room.rank}위
                </Badge>
                <div className="flex items-center gap-1 text-slate-600 bg-white/60 px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                  <Users className="w-3 h-3" />
                  {room.activeUsers}명 참여 중
                </div>
              </div>
              <h4 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                {room.category}
              </h4>
            </div>

            {/* 하단: 대화 내용 & 참여 버튼 */}
            <CardContent className="p-5 flex flex-col flex-1 gap-4">
              {/* 최근 대화 말풍선 */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 relative">
                <div className="absolute -top-1.5 left-4 w-3 h-3 bg-slate-50 border-t border-l border-slate-100 transform rotate-45"></div>
                <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                  {room.lastMessage}
                </p>
              </div>

              <div className="mt-auto">
                <Button className="w-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 transition-all group-hover:border-teal-500 group-hover:text-teal-600">
                  채팅 참여하기 <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
import { Card, CardContent } from "@/components/ui/card";
import { Users, MessageSquare } from "lucide-react";
import Link from "next/link";

interface ChatRoomCardProps {
  id: number;
  name: string;
  bgColor: string;
  textColor: string;
  iconBgColor: string;
  lastMessage?: string;
  lastMessageTime?: string;
  participantCount: number;
  IconComponent?: React.ElementType;
}

export default function ChatRoomCard({
  id,
  name,
  bgColor,
  textColor,
  iconBgColor,
  lastMessage,
  lastMessageTime,
  participantCount,
  IconComponent,
}: ChatRoomCardProps) {
  return (
    <Link
      href={`/community?category=${id}&openChat=true`}
      className="flex-[0_0_100%] md:flex-[0_0_calc(33.333%-0.67rem)] min-w-0"
    >
      <Card className="overflow-hidden hover:shadow-lg transition-all border-gray-200 group h-full flex flex-col hover:-translate-y-1 duration-300 cursor-pointer pt-6 pb-2">
        {/* 상단: 헤더 */}
        <div className="bg-white px-5 pt-1 pb-4 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className={`${iconBgColor} p-2 rounded-lg shrink-0`}>
                {IconComponent && <IconComponent className="w-5 h-5 text-white" />}
              </div>
              <span className={`${bgColor} ${textColor} px-3 py-1 rounded-full text-sm font-bold truncate`}>
                {name}
              </span>
            </div>
            <div className="flex items-center gap-1 text-gray-600 bg-gray-100 px-2 py-1 rounded-full text-xs font-medium shrink-0">
              <Users className="w-3 h-3" />
              {participantCount}명
            </div>
          </div>
        </div>

        {/* 하단: 최근 메시지 */}
        <CardContent className="p-5 flex flex-col flex-1 bg-white justify-center">
          <div className="flex items-start gap-2">
            <MessageSquare className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-700 line-clamp-2 leading-relaxed">
                {lastMessage}
              </p>
              {lastMessageTime && (
                <p className="text-xs text-slate-400 mt-1">
                  {lastMessageTime}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

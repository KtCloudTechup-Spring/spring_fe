"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, RefreshCw, AlertCircle, Users, ArrowRight } from "lucide-react";
import { getMyChats, ChatParticipant } from "@/lib/api/chat";
import { getCommunityById } from "@/lib/constants/communities";

export default function MyChatsTab() {
  const router = useRouter();
  const [chats, setChats] = useState<ChatParticipant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchMyChats();

    // 페이지가 다시 포커스될 때 자동 새로고침
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchMyChats(true); // 조용히 새로고침 (로딩 UI 안 보임)
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const fetchMyChats = async (silent = false) => {
    if (!silent) {
      setIsLoading(true);
    } else {
      setIsRefreshing(true);
    }

    setError(null);

    try {
      const data = await getMyChats();
      setChats(data);
    } catch (error) {
      console.error("Failed to fetch chats:", error);
      setError("채팅방 목록을 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleManualRefresh = () => {
    fetchMyChats();
  };

  const handleChatClick = (communityId: number) => {
    // 커뮤니티 페이지로 이동하면 자동으로 채팅방이 열리도록 쿼리 파라미터 추가
    router.push(`/community?category=${communityId}&openChat=true`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-400">로딩 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-16">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
            </div>
            <div>
              <p className="font-medium text-red-600">{error}</p>
              <Button
                onClick={handleManualRefresh}
                variant="outline"
                className="mt-4"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                다시 시도
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!chats || chats.length === 0) {
    return (
      <Card>
        <CardContent className="py-16">
          <div className="text-center text-gray-500 space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                <MessageCircle className="w-8 h-8 text-gray-400" />
              </div>
            </div>
            <div>
              <p className="font-medium">참여 중인 채팅방이 없습니다</p>
              <p className="text-sm mt-2">커뮤니티에 참여해보세요!</p>
            </div>
            <Button
              onClick={handleManualRefresh}
              variant="outline"
              size="sm"
              disabled={isRefreshing}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
              {isRefreshing ? "새로고침 중..." : "새로고침"}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* 헤더와 새로고침 버튼 */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          참여 중인 채팅방 ({chats.length})
        </h3>
        <Button
          onClick={handleManualRefresh}
          variant="outline"
          size="sm"
          disabled={isRefreshing}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
          {isRefreshing ? "새로고침 중..." : "새로고침"}
        </Button>
      </div>

      {/* 채팅방 리스트 */}
      {chats.map((chat) => {
        const community = getCommunityById(chat.communityId);
        const bgColor = community?.bgColor || "bg-gray-50";
        const textColor = community?.textColor || "text-gray-700";
        const iconBgColor = community?.iconBgColor || "bg-gray-500";
        const communityName = community?.name || "알 수 없음";

        return (
          <div key={chat.chattingRoomId}>
            <Card
              className="cursor-pointer hover:shadow-lg hover:border-slate-300 transition-all group"
              onClick={() => handleChatClick(chat.communityId)}
            >
            <CardContent className="p-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  {/* 아이콘 */}
                  <div className={`w-14 h-14 rounded-xl ${iconBgColor} flex items-center justify-center shrink-0 shadow-sm`}>
                    <MessageCircle className="w-7 h-7 text-white" />
                  </div>

                  {/* 텍스트 정보 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={`${bgColor} ${textColor} border-none font-semibold`}>
                        {communityName}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        <Users className="w-3 h-3 mr-1" />
                        채팅방
                      </Badge>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 truncate">
                      {chat.chattingRoomName}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                      실시간 채팅 참여 중
                    </p>
                  </div>
                </div>

                {/* 화살표 아이콘 */}
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-slate-900 group-hover:translate-x-1 transition-all shrink-0" />
              </div>
            </CardContent>
            </Card>
          </div>
        );
      })}
    </div>
  );
}

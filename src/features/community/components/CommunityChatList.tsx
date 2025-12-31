"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Globe,
  Code,
  Server,
  Bot,
  ShieldCheck,
  Cloud,
  Box,
  Palette,
  Lightbulb,
} from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { COMMUNITIES } from "@/lib/constants/communities";
import { getChatHistory, getChatParticipants } from "@/lib/api/chat";
import ChatRoomCard from "./ChatRoomCard";

// 채팅방 데이터 타입 정의
interface ChatRoomData {
  id: number;
  name: string;
  bgColor: string;
  textColor: string;
  iconBgColor: string;
  lastMessage?: string;
  lastMessageTime?: string;
  participantCount: number;
}

// 커뮤니티 아이콘 매핑
const communityIcons: Record<number, React.ElementType> = {
  1: Globe,      // 풀스택
  2: Code,       // 프론트엔드
  3: Server,     // 백엔드
  4: Bot,        // 생성형 AI
  5: ShieldCheck, // 사이버 보안
  6: Cloud,      // 클라우드 인프라
  7: Box,        // 클라우드 네이티브
  8: Palette,    // 프로덕트 디자인
  9: Lightbulb,  // 프로덕트 매니지먼트
};

// 시간 표시 유틸리티 함수
const getTimeAgo = (dateString?: string): string => {
  if (!dateString) return "";

  const now = new Date();
  const past = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) return "방금 전";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}일 전`;
  return past.toLocaleDateString("ko-KR");
};

export default function CommunityChatList() {
  const [chatRooms, setChatRooms] = useState<ChatRoomData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    slidesToScroll: 1,
    breakpoints: {
      "(min-width: 768px)": { slidesToScroll: 3 },
    },
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  // 스크롤 상태 업데이트
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  // Embla 초기화 시 이벤트 리스너 등록
  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  // 각 커뮤니티의 채팅 데이터 불러오기
  useEffect(() => {
    const fetchAllChatData = async () => {
      setIsLoading(true);

      const chatData: ChatRoomData[] = await Promise.all(
        COMMUNITIES.map(async (community) => {
          try {
            // 각 커뮤니티의 채팅 히스토리 및 참여자 조회
            const [messages, participants] = await Promise.all([
              getChatHistory(community.id),
              getChatParticipants(community.id)
            ]);

            // 최근 메시지 가져오기
            const lastMessage = messages.length > 0
              ? messages[messages.length - 1].content
              : "아직 메시지가 없습니다";

            const lastMessageTime = messages.length > 0
              ? messages[messages.length - 1].createdAt
              : undefined;

            return {
              id: community.id,
              name: community.name,
              bgColor: community.bgColor,
              textColor: community.textColor,
              iconBgColor: community.iconBgColor,
              lastMessage,
              lastMessageTime,
              participantCount: participants.length,
            };
          } catch {
            // 에러 발생 시 기본값 반환
            return {
              id: community.id,
              name: community.name,
              bgColor: community.bgColor,
              textColor: community.textColor,
              iconBgColor: community.iconBgColor,
              lastMessage: "채팅방에 입장해보세요!",
              lastMessageTime: undefined,
              participantCount: 0,
            };
          }
        })
      );

      setChatRooms(chatData);
      setIsLoading(false);
    };

    fetchAllChatData();
  }, []);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  if (isLoading) {
    return (
      <div>
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="w-5 h-5 text-slate-700" />
          <h3 className="text-lg font-bold text-gray-800">
            커뮤니티 채팅방
          </h3>
        </div>
        <div className="flex items-center justify-center py-10">
          <p className="text-slate-400">채팅방 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* 섹션 제목 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-bold text-gray-800">
            커뮤니티 채팅방
          </h3>
        </div>

        {/* 화살표 버튼 (데스크톱만 표시) */}
        <div className="hidden md:flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={scrollPrev}
            disabled={!canScrollPrev}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={scrollNext}
            disabled={!canScrollNext}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* 캐러셀 */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4">
          {chatRooms.map((room) => {
            const IconComponent = communityIcons[room.id];
            return (
              <ChatRoomCard
                key={room.id}
                id={room.id}
                name={room.name}
                bgColor={room.bgColor}
                textColor={room.textColor}
                iconBgColor={room.iconBgColor}
                lastMessage={room.lastMessage}
                lastMessageTime={room.lastMessageTime ? getTimeAgo(room.lastMessageTime) : undefined}
                participantCount={room.participantCount}
                IconComponent={IconComponent}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Users, ArrowRight, Send } from "lucide-react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "@/features/auth/AuthContext";
import {
  getChatHistory,
  joinChatRoom,
  leaveChatRoom,
  getChatParticipants,
} from "@/lib/api/chat";

interface ChatMessage {
  senderId: number;
  senderName: string;
  senderEmail: string;
  senderProfileImage?: string;
  content: string;
  chattingRoomId: number;
  createdAt?: string;
}

interface JwtPayload {
  userId: number;
  id: number;
  email: string;
  exp: number;
  iat: number;
}

interface CommunityChatRoomProps {
  communityName: string;
  communityId: number;
}

const token =
  typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

const decodedToken = token ? jwtDecode<JwtPayload>(token) : null;
const myUserId: number | null = decodedToken?.userId ?? null;

export default function CommunityChatRoom({
  communityName,
  communityId,
}: CommunityChatRoomProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth(); // AuthContext에서 사용자 정보 가져오기
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const [participantCount, setParticipantCount] = useState(0);

  const chatScrollRef = useRef<HTMLDivElement | null>(null);
  const hasAutoJoined = useRef(false);

  // URL을 링크로 변환하는 함수
  const linkifyText = (text: string) => {
    const urlPattern = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlPattern);

    return parts.map((part, index) => {
      if (part.match(urlPattern)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 underline break-all"
            onClick={(e) => e.stopPropagation()}
          >
            {part}
          </a>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  // 채팅방 닫기 (단순 UI 닫기)
  const handleCloseChat = () => {
    stompClient?.deactivate();
    setIsChatOpen(false);
  };

  // 채팅방 나가기 (완전히 퇴장)
  const handleLeaveChat = async () => {
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (!confirm("채팅방을 나가시겠습니까?")) {
      return;
    }

    setIsLeaving(true);
    try {
      await leaveChatRoom(communityId);
      stompClient?.deactivate();
      setIsChatOpen(false);

      window.dispatchEvent(
        new CustomEvent("chatRoomLeft", {
          detail: { communityId },
        })
      );

      const openChat = searchParams.get("openChat");
      if (openChat === "true") {
        router.back();
      }
    } catch (error) {
      console.error("채팅방 나가기 실패:", error);
      alert("채팅방 나가기에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLeaving(false);
    }
  };

  // 입장하기 버튼
  const handleEnterChat = async () => {
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    setIsJoining(true);
    try {
      await joinChatRoom(communityId);
      setIsChatOpen(true);
    } catch (error) {
      console.error("채팅방 입장 실패:", error);
      alert("채팅방 입장에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsJoining(false);
    }
  };

  // 초기 채팅 히스토리 불러오기
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const data = await getChatHistory(communityId);
        setMessages(data.slice(-50));
      } catch (error) {
        console.error("채팅 히스토리 조회 실패:", error);
      }
    };

    fetchChatHistory();
  }, [communityId]);

  // 채팅방 참여자 수 조회
  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const participants = await getChatParticipants(communityId);
        setParticipantCount(participants.length);
      } catch (error) {
        console.error("참여자 조회 실패:", error);
        setParticipantCount(0);
      }
    };

    fetchParticipants();

    const interval = setInterval(fetchParticipants, 5000);

    return () => clearInterval(interval);
  }, [communityId]);

  // URL 쿼리 파라미터로 채팅방 자동 열기
  useEffect(() => {
    const openChat = searchParams.get("openChat");

    if (openChat === "true" && !isChatOpen && !hasAutoJoined.current) {
      hasAutoJoined.current = true;
      handleEnterChat();
    }
  }, [searchParams, isChatOpen]);

  // CustomEvent 리스너 - 공유 요청 처리
  useEffect(() => {
    const handleChatShareRequest = (event: Event) => {
      const customEvent = event as CustomEvent;
      const {
        postId,
        postTitle,
        communityId: targetCommunityId,
      } = customEvent.detail;

      if (
        targetCommunityId === communityId &&
        isChatOpen &&
        stompClient &&
        stompClient.connected
      ) {
        const shareKey = `shared_${postId}_${communityId}`;
        const lastShared = localStorage.getItem(shareKey);
        const now = Date.now();

        if (lastShared && now - parseInt(lastShared) < 10 * 60 * 1000) {
          return;
        }

        const shareMessage = `📢 함께 이야기 나눠봐요!\n\n"${postTitle}"\n\n${window.location.origin}/community/${postId}`;

        setTimeout(() => {
          try {
            stompClient.publish({
              destination: `/pub/chat/${communityId}`,
              body: JSON.stringify({
                content: shareMessage,
              }),
            });

            localStorage.setItem(shareKey, now.toString());
          } catch (error) {
            console.error("메시지 전송 실패:", error);
          }
        }, 100);
      }
    };

    window.addEventListener("chatShareRequest", handleChatShareRequest);

    return () => {
      window.removeEventListener("chatShareRequest", handleChatShareRequest);
    };
  }, [communityId, isChatOpen, stompClient]);

  // STOMP 연결
  useEffect(() => {
    if (!isChatOpen) return;

    const token = localStorage.getItem("accessToken");
    if (!token) return;

    const client = new Client({
      webSocketFactory: () =>
        new SockJS(`${process.env.NEXT_PUBLIC_API_URL}/ws-stomp`),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      onConnect: () => {

        client.subscribe(`/sub/chat/${communityId}`, (message) => {
          const rawBody = JSON.parse(message.body);

          // 백엔드 응답의 userProfileImg를 senderProfileImage로 변환
          const body: ChatMessage = {
            senderId: rawBody.senderId,
            senderName: rawBody.senderName,
            senderEmail: rawBody.senderEmail,
            senderProfileImage: rawBody.userProfileImg || rawBody.senderProfileImage,
            content: rawBody.content,
            chattingRoomId: rawBody.chattingRoomId,
            createdAt: rawBody.createdAt,
          };

          setMessages((prev) => {
            const newMessages = [...prev, body];
            return newMessages.slice(-50);
          });
        });

        // pending share 처리
        const pendingShare = localStorage.getItem("pendingChatShare");
        if (pendingShare) {
          try {
            const shareRequest = JSON.parse(pendingShare);

            if (shareRequest.communityId === communityId) {
              const { postId, postTitle } = shareRequest;

              const shareKey = `shared_${postId}_${communityId}`;
              const lastShared = localStorage.getItem(shareKey);
              const now = Date.now();

              if (!lastShared || now - parseInt(lastShared) >= 10 * 60 * 1000) {
                const shareMessage = `📢 함께 이야기 나눠봐요!\n\n"${postTitle}"\n\n${window.location.origin}/community/${postId}`;

                setTimeout(() => {
                  try {
                    client.publish({
                      destination: `/pub/chat/${communityId}`,
                      body: JSON.stringify({
                        content: shareMessage,
                      }),
                    });

                    localStorage.setItem(shareKey, now.toString());
                    localStorage.removeItem("pendingChatShare");
                  } catch (error) {
                    console.error("메시지 전송 실패:", error);
                  }
                }, 500);
              } else {
                localStorage.removeItem("pendingChatShare");
              }
            }
          } catch (error) {
            console.error("pendingChatShare 파싱 실패:", error);
            localStorage.removeItem("pendingChatShare");
          }
        }
      },
      onStompError: (frame) => {
        console.error("❌ STOMP 에러", frame);
      },
    });

    client.activate();
    setStompClient(client);

    return () => {
      client.deactivate();
    };
  }, [isChatOpen, communityId]);

  // 메시지 전송
  const sendMessage = () => {
    if (!stompClient || !input.trim()) return;

    stompClient.publish({
      destination: `/pub/chat/${communityId}`,
      body: JSON.stringify({
        content: input,
      }),
    });

    setInput("");
  };

  // 자동 스크롤
  useEffect(() => {
    const el = chatScrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.nativeEvent.isComposing) {
      sendMessage();
    }
  };

  return (
    <Card
      className={`
        transition-all duration-300 ease-in-out border-slate-200 flex flex-col group overflow-hidden
        ${
          isChatOpen
            ? "col-span-2 row-span-2 ring-2 ring-slate-900 shadow-xl bg-white"
            : "col-span-1 row-span-1 hover:shadow-md cursor-pointer bg-slate-50"
        }
      `}
    >
      <CardHeader className="pb-3 flex flex-row justify-between items-start space-y-0">
        <div className="flex flex-col gap-2">
          <CardTitle className="text-lg font-bold text-slate-900">
            {communityName} 오픈채팅
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge className="bg-red-500 hover:bg-red-600 border-none animate-pulse">
              LIVE
            </Badge>
            <span className="text-xs text-slate-600 font-bold flex items-center bg-white px-2 py-1 rounded-full shadow-sm border border-slate-100">
              <Users className="w-3 h-3 mr-1" /> {participantCount}명
            </span>
          </div>
        </div>

        {isChatOpen && (
          <div className="flex items-center gap-2">
            <Button
              onClick={handleLeaveChat}
              variant="ghost"
              size="sm"
              className="h-8 text-slate-600 hover:text-red-600 hover:bg-red-50"
              disabled={isLeaving}
            >
              {isLeaving ? "나가는 중..." : "채팅방 나가기"}
            </Button>
            <div className="h-4 w-px bg-slate-300" />
            <Button
              onClick={handleCloseChat}
              variant="ghost"
              size="sm"
              className="h-8 text-slate-600 hover:text-slate-900"
            >
              닫기
            </Button>
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-1 pb-2 flex flex-col">
        {isChatOpen ? (
          <div className="flex-1 flex flex-col justify-between animate-in fade-in duration-500">
            <div
              ref={chatScrollRef}
              className="bg-slate-50 rounded-lg p-3 pb-2 flex-1 mb-1 border border-slate-100 overflow-y-auto max-h-[500px]"
            >
              <div className="space-y-3 text-sm">
                {messages.map((msg, idx) => {
                  const isMine = msg.senderId === myUserId;

                  // 프로필 이미지 URL 결정
                  let profileImageUrl: string | null = null;

                  if (isMine && user?.profileImage) {
                    // 내 메시지인 경우: AuthContext의 프로필 이미지 사용
                    profileImageUrl = user.profileImage !== 'default.png' ? user.profileImage : null;
                  } else if (msg.senderProfileImage && msg.senderProfileImage !== 'default.png') {
                    // 다른 사람 메시지인 경우: 백엔드에서 온 프로필 이미지 사용
                    profileImageUrl = msg.senderProfileImage.startsWith('http')
                      ? msg.senderProfileImage
                      : `${process.env.NEXT_PUBLIC_API_URL}${msg.senderProfileImage}`;
                  }

                  return (
                    <div
                      key={idx}
                      className={`flex gap-2 ${
                        isMine ? "justify-end" : "justify-start"
                      }`}
                    >
                      {!isMine && (
                        <Avatar className="w-8 h-8 shrink-0">
                          {profileImageUrl && (
                            <AvatarImage src={profileImageUrl} alt={msg.senderName} />
                          )}
                          <AvatarFallback className="bg-slate-200 text-slate-600 text-xs">
                            {msg.senderName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      )}

                      <div
                        className={`flex flex-col ${
                          isMine ? "items-end" : "items-start"
                        }`}
                      >
                        <span className="text-xs text-slate-500 mb-1">
                          {msg.senderName}
                        </span>

                        <div
                          className={`p-2 max-w-xs shadow-sm border inline-block whitespace-pre-line ${
                            isMine
                              ? "bg-slate-900 text-white rounded-bl-lg rounded-t-lg"
                              : "bg-white text-slate-700 rounded-br-lg rounded-t-lg"
                          }`}
                        >
                          {linkifyText(msg.content)}
                        </div>
                      </div>

                      {isMine && (
                        <Avatar className="w-8 h-8 shrink-0">
                          {profileImageUrl && (
                            <AvatarImage src={profileImageUrl} alt={msg.senderName} />
                          )}
                          <AvatarFallback className="bg-slate-900 text-white text-xs">
                            {msg.senderName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="메시지를 입력하세요..."
                onKeyDown={handleKeyDown}
              />

              <Button
                size="icon"
                onClick={sendMessage}
                className="bg-slate-900 hover:bg-slate-800"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-500 leading-relaxed">
            지금 들어와서 현직자들과 실시간으로 대화를 나눠보세요!
          </p>
        )}
      </CardContent>

      {!isChatOpen && (
        <CardFooter className="pt-0 pb-4 mt-auto">
          <Button
            onClick={handleEnterChat}
            className="w-full bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 font-bold shadow-sm group-hover:border-slate-900 transition-colors"
            disabled={isJoining}
          >
            {isJoining ? (
              "입장 중..."
            ) : (
              <>
                입장하기 <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

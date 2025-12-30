"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
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
import { Users, ArrowRight, X, Send, MessageSquare } from "lucide-react";
import PostCard from "@/features/posts/components/PostCard";

import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

import { jwtDecode } from "jwt-decode";
import { getChatHistory, joinChatRoom, leaveChatRoom } from "@/lib/api/chat";

const token =
  typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

const decodedToken = token ? jwtDecode<JwtPayload>(token) : null;
console.log("decodedToken:", decodedToken);

const myUserId: number | null = decodedToken?.userId ?? null;
console.log("myUserId:", myUserId);

// 게시글 타입 정의
interface Post {
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
}

// API 응답 게시글 타입
interface ApiPost {
  id: number;
  postTitle?: string;
  title?: string;
  content: string;
  imageUrl?: string;
  authorName: string;
  createdAt: string;
  favorited: boolean;
  commentCount: number;
}

interface CommunityBoardProps {
  communityName: string;
  communityId: number;
}

// 채팅 메세지
interface ChatMessage {
  senderId: number;
  senderName: string;
  senderEmail: string;
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

export function CommunityBoard({
  communityName,
  communityId,
}: CommunityBoardProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  // 채팅
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [stompClient, setStompClient] = useState<Client | null>(null);

  const chatScrollRef = useRef<HTMLDivElement | null>(null);
  const hasAutoJoined = useRef(false);

  // 채팅방 닫기 (단순 UI 닫기)
  const handleCloseChat = () => {
    stompClient?.deactivate();
    setIsChatOpen(false);
  };

  // 채팅방 나가기 (완전히 퇴장 - 마이페이지 참여 목록에서도 제거)
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

      // 마이페이지 채팅 목록 갱신을 위한 이벤트 발생
      window.dispatchEvent(new CustomEvent('chatRoomLeft', {
        detail: { communityId }
      }));

      // openChat 쿼리 파라미터가 있으면 제거하고 뒤로 가기
      const openChat = searchParams.get('openChat');
      if (openChat === 'true') {
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
      setIsChatOpen(true); // 이후 STOMP 연결됨
    } catch (error) {
      console.error("채팅방 입장 실패:", error);
      alert("채팅방 입장에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsJoining(false);
    }
  };

  // 게시글 목록 불러오기
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("accessToken");
        const requestUrl = `/api/posts/community/${communityId}`;

        const response = await fetch(requestUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        if (response.ok) {
          const result = await response.json();
          const postList = result.data?.content || [];

          // API 응답 필드를 컴포넌트가 요구하는 Post 인터페이스로 매핑
          const mappedPosts: Post[] = postList.map((item: ApiPost) => {
            console.log("API 응답 데이터:", item);
            return {
              id: item.id,
              title: item.postTitle || item.title || "제목 없음",
              content: item.content,
              imageUrl: item.imageUrl,
              author: item.authorName,
              date: item.createdAt,
              likes: item.favorited ? 1 : 0,
              comments: item.commentCount,
            };
          });

          setPosts(mappedPosts);
        }
      } catch (error) {
        // 에러 발생시 빈 배열 유지
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [communityId]);

  // 초기 채팅 히스토리 불러오기 (메시지 개수 표시용)
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const data = await getChatHistory(communityId);
        setMessages(data);
      } catch (error) {
        console.error("채팅 히스토리 조회 실패:", error);
        // 히스토리 조회 실패는 사용자에게 알리지 않고 빈 배열 유지
      }
    };

    fetchChatHistory();
  }, [communityId]);

  // URL 쿼리 파라미터로 채팅방 자동 열기
  useEffect(() => {
    const openChat = searchParams.get('openChat');
    if (openChat === 'true' && !isChatOpen && !hasAutoJoined.current) {
      // 채팅방 자동 입장 (한 번만 실행)
      hasAutoJoined.current = true;
      handleEnterChat();
    }
  }, [searchParams, isChatOpen]);

  // STOMP 연결 (채팅방 열렸을 때만)
  useEffect(() => {
    if (!isChatOpen) return;

    const token = localStorage.getItem("accessToken");
    if (!token) return;

    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/ws-stomp"),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      debug: (str) => console.log("[STOMP]", str),
      onConnect: () => {
        console.log("✅ STOMP 연결 성공");

        client.subscribe(`/sub/chat/${communityId}`, (message) => {
          console.log("클라이언트 sub");
          console.log(message.body);
          const body: ChatMessage = JSON.parse(message.body);
          setMessages((prev) => [...prev, body]);
        });
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

  // 메시지 전송 함수
  const sendMessage = () => {
    if (!stompClient || !input.trim()) return;
    console.log("pub 전송: " + input);

    stompClient.publish({
      destination: `/pub/chat/${communityId}`,
      body: JSON.stringify({
        content: input,
      }),
    });

    setInput("");
  };

  useEffect(() => {
    //chatScrollRef.current?.scrollIntoView({ behavior: "smooth" });
    const el = chatScrollRef.current;
    if (!el) {
      return;
    }
    el.scrollTop = el.scrollHeight;
  }, [messages]); //  messages 배열에 새 메시지가 추가될 때마다 자동 실행됨

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.nativeEvent.isComposing) {
      console.log("엔터");
      sendMessage();
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[minmax(200px,auto)]">
      {/* ---------------- 채팅방 카드 ---------------- */}
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
                <MessageSquare className="w-3 h-3 mr-1" /> {messages.length}개
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
                    return (
                      <div
                        key={idx}
                        className={`flex gap-2 ${
                          isMine ? "justify-end" : "justify-start"
                        }`}
                      >
                        {/* 상대방 아바타 */}
                        {!isMine && (
                          <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0" />
                        )}

                        <div className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}>
                          <span className="text-xs text-slate-500 mb-1">
                            {msg.senderName}
                          </span>

                          <div
                            className={`p-2 max-w-xs shadow-sm border inline-block ${
                              isMine
                                ? "bg-slate-900 text-white rounded-bl-lg rounded-t-lg"
                                : "bg-white text-slate-700 rounded-br-lg rounded-t-lg"
                            }`}
                          >
                            {msg.content}
                          </div>
                        </div>

                        {/* 내 아바타 */}
                        {isMine && (
                          <div className="w-8 h-8 rounded-full bg-slate-900 shrink-0" />
                        )}
                      </div>
                      // <div key={idx} className="flex gap-2">
                      //   <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0" />
                      //   <div>
                      //     <span className="text-xs text-slate-500 block mb-1">
                      //       {msg.senderName} {msg.senderEmail}
                      //     </span>
                      //     <div className="bg-white p-2 rounded-r-lg rounded-bl-lg shadow-sm text-slate-700 border">
                      //       {msg.content}
                      //     </div>
                      //   </div>
                      // </div>
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

      {/* ---------------- 게시글 목록 ---------------- */}
      {isLoading ? (
        <div className="col-span-2 flex items-center justify-center py-10">
          <p className="text-slate-400">게시글을 불러오는 중...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="col-span-2 flex items-center justify-center py-10">
          <p className="text-slate-400">아직 게시글이 없습니다.</p>
        </div>
      ) : (
        posts.map((post) => (
          <Link
            key={post.id}
            href={`/community/${post.id}`}
            className="block h-full group"
          >
            <PostCard post={post} />
          </Link>
        ))
      )}
    </div>
  );
}

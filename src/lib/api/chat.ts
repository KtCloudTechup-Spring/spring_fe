// 채팅 메시지 타입
export interface ChatMessage {
  senderId: number;
  senderName: string;
  senderEmail: string;
  content: string;
  chattingRoomId: number;
  createdAt?: string;
}

// 채팅 히스토리 조회
export const getChatHistory = async (communityId: string | number): Promise<ChatMessage[]> => {
  const token = typeof window !== 'undefined' ? localStorage.getItem("accessToken") : null;

  const response = await fetch(`/api/chat/${communityId}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch chat history');
  }

  return response.json();
};

// 채팅방 입장
export const joinChatRoom = async (communityId: string | number): Promise<void> => {
  const token = typeof window !== 'undefined' ? localStorage.getItem("accessToken") : null;

  const response = await fetch(`/api/chat-rooms/${communityId}/join`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  if (!response.ok) {
    throw new Error('Failed to join chat room');
  }
};

// 채팅방 나가기
export const leaveChatRoom = async (communityId: string | number): Promise<void> => {
  const token = typeof window !== 'undefined' ? localStorage.getItem("accessToken") : null;

  const response = await fetch(`/api/chat-rooms/${communityId}/leave`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  if (!response.ok) {
    throw new Error('Failed to leave chat room');
  }
};

// 백엔드 API 응답 타입
interface BackendChatParticipant {
  roomId: number;
  roomName: string;
  communityId: number;
}

// 프론트엔드에서 사용하는 타입 (기존 호환성 유지)
export interface ChatParticipant {
  chattingRoomId: number;
  chattingRoomName: string;
  communityId: number;
}

// 내가 참여한 채팅방 목록 조회
export const getMyChats = async (): Promise<ChatParticipant[]> => {
  const token = typeof window !== 'undefined' ? localStorage.getItem("accessToken") : null;

  const response = await fetch(`/api/chat/me/participant`, {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch my chats: ${response.status}`);
  }

  const result = await response.json();

  // 백엔드 응답을 프론트엔드 타입으로 변환
  const backendData: BackendChatParticipant[] = result.data || result || [];

  return backendData.map((item) => ({
    chattingRoomId: item.roomId,
    chattingRoomName: item.roomName,
    communityId: item.communityId,
  }));
};

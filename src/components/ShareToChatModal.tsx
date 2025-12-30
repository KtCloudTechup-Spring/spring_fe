"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { COMMUNITIES } from "@/lib/constants/communities";

interface ShareToChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: number;
  postTitle: string;
  defaultCommunityId?: number;
}

export function ShareToChatModal({
  isOpen,
  onClose,
  postId,
  postTitle,
  defaultCommunityId,
}: ShareToChatModalProps) {
  const [selectedCommunityId, setSelectedCommunityId] = useState<number>(
    defaultCommunityId || 1
  );
  const [showSuccess, setShowSuccess] = useState(false);

  const handleShare = () => {
    // localStorage에 공유 요청 저장
    const shareRequest = {
      postId,
      postTitle,
      communityId: selectedCommunityId,
      timestamp: Date.now(),
    };

    localStorage.setItem('pendingChatShare', JSON.stringify(shareRequest));

    // CustomEvent를 발생시켜 CommunityBoard에 알림
    window.dispatchEvent(new CustomEvent('chatShareRequest', {
      detail: shareRequest
    }));

    // 성공 메시지 표시
    setShowSuccess(true);

    // 1.5초 후 모달 닫기
    setTimeout(() => {
      setShowSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]">
        {showSuccess ? (
          // 성공 메시지 화면
          <div className="flex flex-col items-center justify-center py-16 animate-in fade-in zoom-in duration-500">
            <div className="relative mb-6">
              {/* 배경 원형 애니메이션 */}
              <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-75" />
              <div className="relative w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
              전송 완료!
            </h3>
            <p className="text-slate-600">
              선택한 채팅방에 게시글이 공유되었습니다 ✨
            </p>
          </div>
        ) : (
          // 커뮤니티 선택 화면
          <>
            <DialogHeader className="pb-2">
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                채팅방 선택
              </DialogTitle>
              <DialogDescription className="text-slate-600">
                어느 커뮤니티에 게시글을 공유할까요?
              </DialogDescription>
            </DialogHeader>

            <div className="py-6">
              <RadioGroup
                value={selectedCommunityId.toString()}
                onValueChange={(value) => setSelectedCommunityId(Number(value))}
                className="grid grid-cols-3 gap-4"
              >
                {COMMUNITIES.map((community) => (
                  <div
                    key={community.id}
                    className={`group relative overflow-hidden rounded-2xl transition-all duration-300 cursor-pointer ${
                      selectedCommunityId === community.id
                        ? 'scale-105 shadow-xl'
                        : 'hover:scale-102 hover:shadow-lg'
                    }`}
                    onClick={() => setSelectedCommunityId(community.id)}
                  >
                    {/* 배경 그라데이션 */}
                    <div className={`absolute inset-0 ${community.bgColor} opacity-10 group-hover:opacity-20 transition-opacity`} />

                    {/* 선택 시 테두리 효과 */}
                    {selectedCommunityId === community.id && (
                      <div className="absolute inset-0 ring-2 ring-slate-900 ring-offset-2 rounded-2xl" />
                    )}

                    <div className="relative p-6 flex flex-col items-center justify-center gap-3 bg-white/80 backdrop-blur-sm min-h-[120px]">
                      {/* 체크 아이콘 */}
                      <div className={`absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                        selectedCommunityId === community.id
                          ? `${community.bgColor} scale-100`
                          : 'bg-slate-100 scale-0 group-hover:scale-100'
                      }`}>
                        {selectedCommunityId === community.id && (
                          <svg className={`w-4 h-4 ${community.textColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>

                      <RadioGroupItem
                        value={community.id.toString()}
                        id={`community-${community.id}`}
                        className="sr-only"
                      />

                      <Label
                        htmlFor={`community-${community.id}`}
                        className="flex flex-col items-center gap-2 cursor-pointer w-full"
                      >
                        <span className={`${community.bgColor} ${community.textColor} px-4 py-3 rounded-full text-sm font-bold text-center w-full shadow-sm min-h-10 flex items-center justify-center leading-tight`}>
                          {community.name}
                        </span>
                        {defaultCommunityId === community.id && (
                          <span className="text-xs text-slate-500">현재 게시판</span>
                        )}
                      </Label>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={onClose}>
                취소
              </Button>
              <Button onClick={handleShare} className="bg-slate-900 hover:bg-slate-800">
                공유하기
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

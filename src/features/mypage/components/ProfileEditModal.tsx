"use client";

import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Upload, Loader2 } from "lucide-react";
import { useAuth } from "@/features/auth/AuthContext";

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileEditModal({ isOpen, onClose }: ProfileEditModalProps) {
  const { user, refreshUser } = useAuth();
  const [nickname, setNickname] = useState(user?.name || "");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 파일 형식 검증
    if (!file.type.startsWith("image/")) {
      setError("이미지 파일만 업로드 가능합니다.");
      return;
    }

    // 파일 크기 검증 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("파일 크기는 5MB 이하여야 합니다.");
      return;
    }

    setProfileImage(file);
    setError(null);

    // 미리보기 생성
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("accessToken");

      // 1. 프로필 사진 업로드
      if (profileImage) {
        const formData = new FormData();
        formData.append("file", profileImage);

        const imageResponse = await fetch("/api/profile/avatar", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (!imageResponse.ok) {
          throw new Error("프로필 사진 업로드에 실패했습니다.");
        }
      }

      // 2. 닉네임 수정
      if (nickname !== user?.name) {
        const nicknameResponse = await fetch("/api/profile/profile-change", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name: nickname }),
        });

        if (!nicknameResponse.ok) {
          throw new Error("닉네임 변경에 실패했습니다.");
        }
      }

      // 3. 사용자 정보 새로고침
      await refreshUser();

      // 4. 모달 닫기
      onClose();
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "프로필 수정에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setNickname(user?.name || "");
    setProfileImage(null);
    setPreviewImage(null);
    setError(null);
  };

  const handleClose = () => {
    if (!isLoading) {
      resetForm();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>프로필 수정</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* 프로필 사진 */}
          <div className="flex flex-col items-center gap-4">
            <Avatar className="w-24 h-24">
              {previewImage ? (
                <AvatarImage src={previewImage} alt="Preview" />
              ) : user?.profileImage && user.profileImage !== 'default.png' ? (
                <AvatarImage src={user.profileImage} alt={user.name} />
              ) : (
                <AvatarFallback className="bg-gray-100">
                  <User className="w-12 h-12 text-gray-400" />
                </AvatarFallback>
              )}
            </Avatar>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageSelect}
            />

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
            >
              <Upload className="w-4 h-4 mr-2" />
              사진 변경
            </Button>
          </div>

          {/* 닉네임 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">닉네임</label>
            <Input
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="닉네임을 입력하세요"
              disabled={isLoading}
              maxLength={20}
            />
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            취소
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading || (!profileImage && nickname === user?.name)}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                저장 중...
              </>
            ) : (
              "저장"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

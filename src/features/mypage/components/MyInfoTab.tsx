"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/AuthContext";
import { User, Mail, Users, UserCircle, Edit } from "lucide-react";
import ProfileEditModal from "./ProfileEditModal";

export default function MyInfoTab() {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!user) return null;

  return (
    <>
      <div className="space-y-6">
        {/* 프로필 정보 카드 */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-6">
              {/* 프로필 이미지 */}
              <div className="relative">
                <Avatar className="w-24 h-24">
                  {user.profileImage && user.profileImage !== 'default.png' && (
                    <AvatarImage src={user.profileImage} alt={user.name} />
                  )}
                  <AvatarFallback className="bg-gray-100">
                    <User className="w-12 h-12 text-gray-400" />
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                  onClick={() => setIsModalOpen(true)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </div>

              {/* 사용자 정보 */}
              <div className="flex-1 space-y-4">
                {/* 닉네임 */}
                <div>
                  <div className="relative mb-2">
                    <label className="text-sm font-medium text-gray-700">닉네임</label>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute right-0 top-1/2 -translate-y-1/2 h-6 px-2 text-xs"
                      onClick={() => setIsModalOpen(true)}
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      수정
                    </Button>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">{user.name}</p>
                </div>

              {/* 이메일 */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  이메일
                </label>
                <p className="text-gray-900">{user.email}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 추가 정보 카드 */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">기타 정보</h3>
          <div className="space-y-4">
            {/* 커뮤니티 */}
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">참여 중인 과정</p>
                  <p className="font-medium text-gray-900">{user.communityName}</p>
                </div>
              </div>
            </div>

            {/* 역할 */}
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <UserCircle className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">역할</p>
                  <p className="font-medium text-gray-900">{user.role}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>

      {/* 프로필 수정 모달 */}
      <ProfileEditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}

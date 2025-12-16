"use client";

import { useState } from "react";
import { useAuth } from "@/features/auth/AuthContext";
import { useRouter } from "next/navigation";
import ProfileCard from "@/features/users/components/ProfileCard";
import MyInfoTab from "@/features/mypage/components/MyInfoTab";
import MyPostsTab from "@/features/mypage/components/MyPostsTab";
import MyChatsTab from "@/features/mypage/components/MyChatsTab";

type TabType = "info" | "posts" | "chats";

export default function MyPage() {
  const [activeTab, setActiveTab] = useState<TabType>("info");
  const { user, isLoading } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return (
      <main className="max-w-[1200px] mx-auto pt-8 px-4 pb-20">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-gray-400">로딩 중...</p>
        </div>
      </main>
    );
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  const tabs = [
    { id: "info" as TabType, label: "내 정보" },
    { id: "posts" as TabType, label: "내가 작성한 글" },
    { id: "chats" as TabType, label: "내가 참여 중인 채팅" },
  ];

  return (
    <main className="max-w-[1200px] mx-auto pt-8 px-4 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 왼쪽: 프로필 카드 */}
        <section className="col-span-1">
          <div className="sticky top-24">
            <ProfileCard currentCommunityId={0} />
          </div>
        </section>

        {/* 오른쪽: 탭 콘텐츠 영역 */}
        <section className="col-span-1 lg:col-span-3">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-slate-900">마이페이지</h1>
            <p className="text-slate-500 mt-2">
              나의 활동 현황을 한눈에 확인하세요.
            </p>
          </div>

          {/* 탭 네비게이션 */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    py-4 px-1 border-b-2 font-medium text-sm transition-colors
                    ${
                      activeTab === tab.id
                        ? "border-slate-900 text-slate-900"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }
                  `}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* 탭 콘텐츠 */}
          <div className="mt-6">
            {activeTab === "info" && <MyInfoTab />}
            {activeTab === "posts" && <MyPostsTab />}
            {activeTab === "chats" && <MyChatsTab />}
          </div>
        </section>
      </div>
    </main>
  );
}

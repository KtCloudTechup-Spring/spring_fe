import { Button } from "@/components/ui/button";
import { PenSquare } from "lucide-react";
import Link from "next/link";
import ProfileCard from "@/features/users/components/ProfileCard";
import { CommunityBoard } from "@/features/community/components/CommunityBoard";

// 가짜 DB
const communities = [
  { id: 1, name: "풀스택" },
  { id: 2, name: "프론트엔드" },
  { id: 3, name: "백엔드" },
  { id: 4, name: "생성형 AI" },
  { id: 5, name: "사이버 보안" },
  { id: 6, name: "클라우드 인프라" },
  { id: 7, name: "클라우드 네이티브" },
  { id: 8, name: "프로덕트 디자인" },
  { id: 9, name: "프로덕트 매니지먼트" },
];

// 목데이터 (비로그인시 테스트용)
// const mockUser = {
//   name: "홍길동",
//   email: "hong@example.com",
//   stats: { posts: 24, participatingChats:3, comments: 156, likes: 89 },
//   profileImage: "https://github.com/shadcn.png"
// };

// 목데이터 (로그인시 테스트용 - 현재 null)
const mockUser = null;

interface PageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function CommunityPage({ searchParams }: PageProps) {
  const query = await searchParams;
  const categoryId = query.category ?? "1";
  const communityId = Number(categoryId);
  
  const community = communities.find((c) => c.id === communityId);

  if (!community) {
    return <div className="p-10 text-center">존재하지 않는 게시판입니다.</div>;
  }

  return (
    <main className="max-w-[1200px] mx-auto pt-8 px-4 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* 사이드바 */}
        <section className="hidden lg:block col-span-1">
          <div className="sticky top-24">
            <ProfileCard user={mockUser} currentCommunityId={communityId} />
          </div>
        </section>

        {/* 메인 콘텐츠 */}
        <section className="col-span-1 lg:col-span-3">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              {community.name} 게시판
            </h1>
            
          </div>

          {/* 알맹이 컴포넌트 호출 */}
          <CommunityBoard communityName={community.name} />
        </section>
      </div>
    </main>
  );
}
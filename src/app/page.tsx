import ProfileCard from "@/features/users/components/ProfileCard";
import CommunityChatList from "@/features/community/components/CommunityChatList";
import RecentPostList from "@/features/posts/components/RecentPostList";

export default function Home() {
  return (
    <main className="max-w-[1200px] mx-auto pt-8 px-4 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* [LEFT] 사이드바 */}
        <section className="hidden lg:block col-span-1">
          <ProfileCard/>
        </section>

        {/* [RIGHT] 메인 콘텐츠 */}
        <section className="col-span-1 lg:col-span-3 space-y-10">
          {/* 1. 커뮤니티 채팅방 (실시간 데이터 연동) */}
          <CommunityChatList />

          {/* 2. 최근 게시글 목록 */}
          <RecentPostList />
        </section>
      </div>
    </main>
  );
}

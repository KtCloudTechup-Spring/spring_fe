import ProfileCard from "@/features/users/components/ProfileCard";
import PopularChatList from "@/features/community/components/PopularChatList";
import RecentPostList from "@/features/posts/components/RecentPostList";

// 목데이터, 비로그인시 화면 확인하려면 주석처리 하기
const mockUser = {
  name: "홍길동",
  email: "hong@example.com",
  stats: { posts: 24, participatingChats: 3, comments: 156, likes: 89 },
  profileImage: "https://github.com/shadcn.png",
};

// 비로그인시 화면 확인하려면 주석처리 풀기
// const mockUser = null;

// 인기 채팅방 목데이터
const mockPopularChatRooms = [
  {
    id: 1,
    rank: 1,
    category: "풀스택 개발",
    title: "풀스택 챌린저 모임",
    lastMessage:
      "Next.js 14 서버 액션 쓰실 때 에러 처리 어떻게 하시나요? 저는 try-catch로 감싸서 하는데...",
    activeUsers: 128,
    bgColor: "bg-blue-50",
    rankColor: "bg-blue-500",
  },
  {
    id: 2,
    rank: 2,
    category: "생성형 AI",
    title: "프롬프트 엔지니어링",
    lastMessage:
      "오 이번에 나온 Claude 3.5 성능 진짜 미쳤네요 ㄷㄷ 코딩 실력이 GPT-4보다 나은 듯?",
    activeUsers: 84,
    bgColor: "bg-purple-50",
    rankColor: "bg-purple-500",
  },
  {
    id: 3,
    rank: 3,
    category: "클라우드 인프라",
    title: "AWS 자격증 스터디",
    lastMessage:
      "SAA 시험 합격했습니다! 덤프 문제 공유드릴게요 필요하신 분 계신가요?",
    activeUsers: 56,
    bgColor: "bg-orange-50",
    rankColor: "bg-orange-500",
  },
];

// ===============================================

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
          {/* 1. 인기 채팅방 목록 (교체됨!) */}
          <PopularChatList chatRooms={mockPopularChatRooms} />

          {/* 2. 최근 게시글 목록 */}
          <RecentPostList />
        </section>
      </div>
    </main>
  );
}

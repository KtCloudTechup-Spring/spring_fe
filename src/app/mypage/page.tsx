import { Separator } from "@/components/ui/separator";
import ProfileCard from "@/features/users/components/ProfileCard";
import PostCard from "@/features/posts/components/PostCard";

// 내 정보 (가짜 데이터) - 나중엔 서버에서 받아옴
const myProfile = {
  id: 1,
  name: "나의 닉네임",
  role: "CHALLENGERS",
  email: "myemail@example.com",
  image: null, // 프로필 이미지 URL이 있다면 여기에
} as any;

// 내가 쓴 글 (가짜 데이터)
const myPosts = [
  {
    id: 101,
    tag: "질문",
    title: "리팩토링하면서 배운 점 공유합니다",
    content: "처음에는 폴더 구조 잡는 게 귀찮았는데, 막상 나누고 보니 유지보수가 정말 편해지네요. 특히 features로 나누는 전략이...",
    author: "나의 닉네임",
    date: "방금 전",
    likes: 5,
    comments: 2,
    badgeColor: "bg-blue-100 text-blue-600 hover:bg-blue-100"
  },
  {
    id: 102,
    tag: "잡담",
    title: "오늘 저녁 메뉴 추천 좀 해주세요",
    content: "코딩하다 보니 배가 너무 고픈데 다들 뭐 드시나요? 간단하게 먹을 수 있는 걸로 추천 부탁드립니다.",
    author: "나의 닉네임",
    date: "2시간 전",
    likes: 0,
    comments: 8,
    badgeColor: "bg-gray-100 text-gray-600 hover:bg-gray-100"
  },
];

export default function MyPage() {
  return (
    <main className="max-w-[1200px] mx-auto pt-8 px-4 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* 왼쪽: 프로필 카드 재사용 */}
        <section className="col-span-1">
          <div className="sticky top-24">
            <ProfileCard user={myProfile} currentCommunityId={0} />
          </div>
        </section>

        {/* 오른쪽: 내가 쓴 글 목록 */}
        <section className="col-span-1 lg:col-span-3">
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 pb-4">
              <h1 className="text-2xl font-bold text-slate-900">내 활동</h1>
              <p className="text-slate-500 mt-1">내가 작성한 게시글과 활동 내역을 확인하세요.</p>
            </div>
            
            <Separator />
            
            <div className="p-6 bg-slate-50 min-h-[500px]">
              <h2 className="text-lg font-bold text-slate-800 mb-4">작성한 게시글 ({myPosts.length})</h2>
              
              <div className="grid gap-4">
                {myPosts.length > 0 ? (
                  myPosts.map((post) => (
                    <div key={post.id} className="h-full">
                      <PostCard post={post} />
                    </div>
                  ))
                ) : (
                  <div className="text-center py-20 text-slate-400">
                    아직 작성한 게시글이 없습니다.
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}
// loading.tsx
export default function Loading() {
  // 실제 콘텐츠의 레이아웃과 비슷한 모양의 스켈레톤 UI를 반환합니다.
  return (
    <div className="animate-pulse space-y-4 p-4 max-w-lg mx-auto">
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-24 bg-gray-200 rounded w-full mt-8"></div>
    </div>
  )
}
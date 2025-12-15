import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <h2 className="text-3xl font-semibold text-red-600 mb-2">페이지를 찾을 수 없습니다.</h2>
      <p className="text-lg text-gray-600 mb-8">요청하신 리소스는 존재하지 않거나 제거되었습니다.</p>
      <Link 
        href="/"
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
      >
        홈페이지로 돌아가기
      </Link>
    </div>
  )
}
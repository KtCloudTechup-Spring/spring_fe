import LoginForm from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
      {/* 로고나 앱 이름 등을 추가하고 싶다면 여기에 배치 */}

      <LoginForm />
      
    </div>
  );
}
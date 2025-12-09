"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { LogIn } from "lucide-react";
import Link from "next/link";

export default function LoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 나중에 실제 백엔드 연동 시 여기에 API 호출 로직 추가
    console.log("로그인 시도:", formData);
    
    // 임시: 홈으로 이동
    router.push("/");
  };

  return (
    <Card className="w-full max-w-[400px] shadow-lg border-slate-200">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">로그인</CardTitle>
        <CardDescription className="text-center">
          이메일과 비밀번호를 입력해 주세요.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">이메일</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="example@email.com" 
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">비밀번호</Label>
            <Input 
              id="password" 
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          
          <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold">
            <LogIn className="w-4 h-4 mr-2" /> 로그인
          </Button>

          <div className="text-center text-sm text-slate-500 mt-4">
            계정이 없으신가요?{" "}
            <Link href="/signup" className="text-slate-900 font-bold hover:underline">
              회원가입
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
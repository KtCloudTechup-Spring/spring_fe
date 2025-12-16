"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LogIn, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useLoginForm } from "@/hooks/useLoginForm";
import { FormField } from "@/components/ui/FormField";

export default function LoginForm() {
  const { formData, errors, isLoading, handleChange, handleSubmit } =
    useLoginForm();

  return (
    <Card className="w-full max-w-[400px] shadow-lg border-slate-200">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">로그인</CardTitle>
        <CardDescription className="text-center">
          이메일과 비밀번호를 입력해 주세요.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 전체 폼 에러 메시지 */}
          {errors.form && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
              <p className="text-sm text-red-600">{errors.form}</p>
            </div>
          )}

          {/* 이메일 */}
          <FormField
            label="이메일"
            name="email"
            type="email"
            placeholder="example@email.com"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
            disabled={isLoading}
          />

          {/* 비밀번호 */}
          <FormField
            label="비밀번호"
            name="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            required
            disabled={isLoading}
          />

          <Button
            type="submit"
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <LogIn className="w-4 h-4 mr-2" />
            )}
            {isLoading ? "로그인 중..." : "로그인"}
          </Button>

          <div className="text-center text-sm text-slate-500 mt-4">
            계정이 없으신가요?{" "}
            <Link
              href="/signup"
              className="text-slate-900 font-bold hover:underline"
            >
              회원가입
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
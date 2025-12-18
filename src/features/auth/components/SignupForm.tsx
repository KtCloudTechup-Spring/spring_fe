"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { UserPlus, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useSignupForm } from "@/hooks/useSignupForm";
import { FormField } from "@/components/ui/FormField";
import type { Community } from "@/types/auth";

const communities: Community[] = [
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

export default function SignupForm() {
  const {
    formData,
    errors,
    isLoading,
    handleChange,
    handleSubmit,
  } = useSignupForm();

  return (
    <Card className="w-full max-w-[600px] shadow-lg border-slate-200 my-8">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          회원가입
        </CardTitle>
        <CardDescription className="text-center">
          TechUp 챌린저 허브의 멤버가 되어보세요.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 전체 폼 에러 메시지 */}
          {errors.form && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
              <p className="text-sm text-red-600">{errors.form}</p>
            </div>
          )}

          {/* 1. 이메일 */}
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

          {/* 2. 비밀번호 */}
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

          {/* 3. 비밀번호 확인 */}
          <FormField
            label="비밀번호 확인"
            name="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            required
            disabled={isLoading}
          />

          {/* 4. 이름 (닉네임) */}
          <FormField
            label="이름 (닉네임)"
            name="name"
            placeholder="활동할 닉네임을 입력하세요"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            required
            disabled={isLoading}
          />

          {/* 5. 참여 중인 과정 */}
          <div className="space-y-3">
            <Label className="text-base">
              참여 중인 과정 <span className="text-red-500">*</span>
            </Label>
            <div
              className={`p-4 border rounded-lg bg-slate-50 ${
                errors.communityId ? "border-red-500" : "border-slate-200"
              }`}
            >
              <div className="grid grid-cols-3 gap-x-2 gap-y-4">
                {communities.map((c) => (
                  <label
                    key={c.id}
                    className="flex items-center space-x-2 cursor-pointer hover:opacity-80"
                  >
                    <input
                      type="radio"
                      name="communityId"
                      value={c.id}
                      checked={formData.communityId === String(c.id)}
                      onChange={handleChange}
                      disabled={isLoading}
                      className="w-4 h-4 accent-slate-900 cursor-pointer shrink-0"
                    />
                    <span className="text-sm font-medium text-slate-700 truncate">
                      {c.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            {errors.communityId && (
              <p className="text-sm text-red-500">{errors.communityId}</p>
            )}
          </div>

          {/* 6. 개인정보 동의 */}
          <div className="space-y-2">
            <div
              className={`flex items-center space-x-3 p-4 border rounded-lg bg-slate-50 ${
                errors.agreed ? "border-red-500" : "border-slate-200"
              }`}
            >
              <input
                id="terms"
                name="agreed"
                type="checkbox"
                checked={formData.agreed}
                onChange={handleChange}
                disabled={isLoading}
                className="w-4 h-4 accent-slate-900 cursor-pointer shrink-0"
              />
              <label
                htmlFor="terms"
                className="text-sm text-slate-600 leading-snug cursor-pointer select-none"
              >
                <span className="font-bold text-slate-900">
                  개인 정보 수집 및 이용에 동의합니다.
                </span>{" "}
                <span className="text-red-500">*</span>
                <br />
                <span className="text-xs text-slate-500 block mt-1">
                  수집된 정보는 서비스 이용을 위해서만 사용되며, 회원 탈퇴 시
                  즉시 파기됩니다.
                </span>
              </label>
            </div>
            {errors.agreed && (
              <p className="text-sm text-red-500">{errors.agreed}</p>
            )}
          </div>

          {/* 가입 버튼 */}
          <Button
            type="submit"
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold h-12 text-md mt-4"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                가입 중...
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4 mr-2" /> 가입 완료하기
              </>
            )}
          </Button>

          <div className="text-center text-sm text-slate-500 mt-4">
            이미 계정이 있으신가요?{" "}
            <Link
              href="/login"
              className="text-slate-900 font-bold hover:underline"
            >
              로그인
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
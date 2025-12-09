"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";

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

function PostFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCategoryId = searchParams.get("category");

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    communityId: initialCategoryId ? initialCategoryId : "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, communityId: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.communityId) {
      alert("게시판을 선택해주세요.");
      return;
    }
    if (!formData.title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }
    if (!formData.content.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }

    const payload = {
      user_id: 1, 
      community_id: Number(formData.communityId),
      title: formData.title,
      content: formData.content,
    };

    console.log("전송 데이터:", payload);
    alert("게시글이 등록되었습니다! (임시)");
    router.push(`/community/${formData.communityId}`);
  };

  return (
    <>
      <div className="absolute top-8 left-8 hidden lg:block">
        <button 
          onClick={() => router.back()}
          className="flex items-center text-slate-500 hover:text-slate-900 transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> 뒤로가기
        </button>
      </div>

      <Card className="w-full max-w-[800px] shadow-lg border-slate-200">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-slate-900">글쓰기</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="community">게시판 선택 <span className="text-red-500">*</span></Label>
              <Select onValueChange={handleSelectChange} defaultValue={formData.communityId}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="게시판을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {communities.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">제목 <span className="text-red-500">*</span></Label>
              <Input 
                id="title" 
                placeholder="제목을 입력하세요" 
                value={formData.title}
                onChange={handleChange}
                className="text-lg font-medium h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">내용 <span className="text-red-500">*</span></Label>
              <Textarea 
                id="content" 
                placeholder="자유롭게 내용을 작성해주세요." 
                className="min-h-[400px] resize-none text-base leading-relaxed p-4"
                value={formData.content}
                onChange={handleChange}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => router.back()}
                className="h-12 px-6"
              >
                취소
              </Button>
              <Button 
                type="submit" 
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold h-12 px-8"
              >
                등록하기
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
}

export default function PostForm() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PostFormContent />
    </Suspense>
  );
}
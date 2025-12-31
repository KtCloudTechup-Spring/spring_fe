"use client";

import { useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2, X, ImageIcon } from "lucide-react";
import { useAuth } from "@/features/auth/AuthContext"; 

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
  const { user, token } = useAuth();
  const initialCategoryId = searchParams.get("category");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    communityId: initialCategoryId ? initialCategoryId : "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, communityId: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 파일 형식 검증
    if (!file.type.startsWith("image/")) {
      setImageError("이미지 파일만 업로드 가능합니다.");
      return;
    }

    // 파일 크기 검증 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setImageError("파일 크기는 5MB 이하여야 합니다.");
      return;
    }

    setImageFile(file);
    setImageError(null);

    // 미리보기 생성
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setImageError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. 로그인 여부 확인
    if (!user || !token) {
      alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
      router.push("/login");
      return;
    }

    // 2. 클라이언트 측 유효성 검사
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

    setIsLoading(true);

    try {
      // 3. FormData 구성 (백엔드 MULTIPART_FORM_DATA 형식에 맞춤)
      const formDataToSend = new FormData();

      // request 파트: JSON 문자열을 Blob으로 전송 (Content-Type 명시)
      const requestData = {
        communityId: Number(formData.communityId),
        title: formData.title,
        content: formData.content,
      };

      const requestBlob = new Blob([JSON.stringify(requestData)], {
        type: "application/json",
      });
      formDataToSend.append("request", requestBlob);

      // image 파트: 이미지 파일 (선택사항)
      if (imageFile) {
        formDataToSend.append("image", imageFile);
      }

      // 디버깅: FormData 내용 확인
      console.log("=== FormData 전송 내용 ===");
      console.log("Request Data:", requestData);
      console.log("Image File:", imageFile?.name || "없음");
      for (const pair of formDataToSend.entries()) {
        console.log(pair[0], pair[1]);
      }

      // 4. API 호출
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // Content-Type은 FormData 사용 시 자동 설정됨 (boundary 포함)
        },
        body: formDataToSend,
      });

      console.log("=== API 응답 ===");
      console.log("Status:", response.status);
      console.log("Status Text:", response.statusText);

      if (response.ok) {
        const result = await response.json();
        console.log("성공 응답:", result);
        const newPostId = result.data?.postId || result.postId || "등록 완료";

        alert(`게시글이 성공적으로 등록되었습니다! (ID: ${newPostId})`);
        router.push(`/community?category=${formData.communityId}`);
      } else if (response.status === 401) {
        alert("로그인 정보가 유효하지 않습니다. 다시 로그인 해주세요.");
        router.push("/login");
      } else if (response.status === 400) {
        const errorData = await response.json();
        console.error("400 에러 응답:", errorData);
        alert(
          `입력 오류: ${errorData.message || "입력하신 정보를 확인해주세요."}`
        );
      } else if (response.status === 500) {
        let errorData;
        try {
          errorData = await response.json();
          console.error("500 에러 응답:", errorData);
        } catch {
          const errorText = await response.text();
          console.error("500 에러 (텍스트):", errorText);
        }
        alert(
          `서버 오류가 발생했습니다. 백엔드 로그를 확인해주세요.\n에러: ${errorData?.message || "Internal Server Error"}`
        );
      } else {
        const errorText = await response.text();
        console.error("기타 에러:", errorText);
        throw new Error(`서버에서 글 등록에 실패했습니다. (${response.status})`);
      }
    } catch (error: any) {
      console.error("게시글 등록 중 오류 발생:", error);
      alert(`오류가 발생했습니다: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
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
          <CardTitle className="text-2xl font-bold text-slate-900">
            글쓰기 ({user ? user.name : '비로그인'})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="community">
                게시판 선택 <span className="text-red-500">*</span>
              </Label>
              <Select
                onValueChange={handleSelectChange}
                defaultValue={formData.communityId}
              >
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
              <Label htmlFor="title">
                제목 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                placeholder="제목을 입력하세요"
                value={formData.title}
                onChange={handleChange}
                className="text-lg font-medium h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">
                내용 <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="content"
                placeholder="자유롭게 내용을 작성해주세요."
                className="min-h-[400px] resize-none text-base leading-relaxed p-4"
                value={formData.content}
                onChange={handleChange}
              />
            </div>

            {/* 이미지 업로드 */}
            <div className="space-y-2">
              <Label>이미지 첨부 (선택)</Label>

              {/* 이미지 미리보기 */}
              {imagePreview && (
                <div className="relative inline-block">
                  <img
                    src={imagePreview}
                    alt="미리보기"
                    className="max-w-full max-h-64 rounded-lg border border-slate-200"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    disabled={isLoading}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* 이미지 업로드 버튼 */}
              {!imagePreview && (
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                    className="w-full h-32 border-2 border-dashed border-slate-300 hover:border-slate-400 hover:bg-slate-50"
                  >
                    <div className="flex flex-col items-center gap-2 text-slate-500">
                      <ImageIcon className="w-8 h-8" />
                      <span className="text-sm">이미지를 선택하세요 (최대 5MB)</span>
                    </div>
                  </Button>
                </div>
              )}

              {/* 에러 메시지 */}
              {imageError && (
                <p className="text-sm text-red-500">{imageError}</p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="h-12 px-6"
                disabled={isLoading}
              >
                취소
              </Button>
              <Button
                type="submit"
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold h-12 px-8"
                disabled={isLoading}
              >
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        등록 중...
                    </>
                ) : (
                    "등록하기"
                )}
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
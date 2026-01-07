"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
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
import { COMMUNITIES } from "@/lib/constants/communities";
import { getPostById, updatePost } from "@/lib/api/posts";

export default function PostEditPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;
  const { user, token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    communityId: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);

  // 기존 게시글 데이터 불러오기
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsDataLoading(true);
        const response = await getPostById(postId);
        const post = response.data;

        setFormData({
          title: post.title,
          content: post.content,
          communityId: post.communityId ? String(post.communityId) : "",
        });

        if (post.imageUrl) {
          setExistingImageUrl(post.imageUrl);
          setImagePreview(post.imageUrl);
        }
      } catch (error) {
        console.error("게시글 조회 실패:", error);
        alert("게시글을 불러오는데 실패했습니다.");
        router.back();
      } finally {
        setIsDataLoading(false);
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId, router]);

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

    if (!file.type.startsWith("image/")) {
      setImageError("이미지 파일만 업로드 가능합니다.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setImageError("파일 크기는 5MB 이하여야 합니다.");
      return;
    }

    setImageFile(file);
    setImageError(null);

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
    setExistingImageUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !token) {
      alert("로그인이 필요합니다.");
      router.push("/login");
      return;
    }

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
      const formDataToSend = new FormData();

      const requestData = {
        communityId: Number(formData.communityId),
        title: formData.title,
        content: formData.content,
      };

      const requestBlob = new Blob([JSON.stringify(requestData)], {
        type: "application/json",
      });
      formDataToSend.append("request", requestBlob);

      if (imageFile) {
        formDataToSend.append("image", imageFile);
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/${postId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (response.ok) {
        alert("게시글이 수정되었습니다!");
        router.push(`/community/${postId}`);
      } else if (response.status === 401) {
        alert("로그인 정보가 유효하지 않습니다.");
        router.push("/login");
      } else {
        const errorText = await response.text();
        console.error("수정 실패:", errorText);
        throw new Error(`게시글 수정에 실패했습니다. (${response.status})`);
      }
    } catch (error: any) {
      console.error("게시글 수정 중 오류:", error);
      alert(`오류가 발생했습니다: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (isDataLoading) {
    return (
      <div className="min-h-screen bg-slate-50 py-10 px-4 flex justify-center items-center">
        <p className="text-slate-400">게시글을 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 flex justify-center items-start">
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
            글 수정 ({user ? user.name : '비로그인'})
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
                value={formData.communityId}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="게시판을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {COMMUNITIES.map((c) => (
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
                        수정 중...
                    </>
                ) : (
                    "수정하기"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

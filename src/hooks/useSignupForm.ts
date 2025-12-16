import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ApiError, apiPost } from "@/lib/api";
import type {
  SignupFormData,
  SignupErrors,
  SignupRequest,
  SignupResponse,
} from "@/types/auth";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function useSignupForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState<SignupFormData>({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    communityId: "",
    agreed: false,
  });
  const [errors, setErrors] = useState<SignupErrors>({});

  // Clean up avatar preview URL on unmount
  useEffect(() => {
    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  const validateForm = (): boolean => {
    const newErrors: SignupErrors = {};

    // 이메일 검증
    if (!formData.email) {
      newErrors.email = "이메일을 입력해주세요.";
    } else if (!EMAIL_REGEX.test(formData.email)) {
      newErrors.email = "올바른 이메일 형식이 아닙니다.";
    }

    // 비밀번호 검증
    if (!formData.password) {
      newErrors.password = "비밀번호를 입력해주세요.";
    } else if (formData.password.length < 8) {
      newErrors.password = "비밀번호는 최소 8자 이상이어야 합니다.";
    }

    // 비밀번호 확인 검증
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "비밀번호 확인을 입력해주세요.";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "비밀번호가 일치하지 않습니다.";
    }

    // 이름 검증
    if (!formData.name.trim()) {
      newErrors.name = "이름을 입력해주세요.";
    }

    // 과정 선택 검증
    if (!formData.communityId) {
      newErrors.communityId = "참여 중인 과정을 선택해주세요.";
    }

    // 약관 동의 검증
    if (!formData.agreed) {
      newErrors.agreed = "개인정보 수집 및 이용에 동의해야 합니다.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // 해당 필드의 에러 클리어
    if (errors[name as keyof SignupErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 파일 크기 검증 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        avatar: "이미지 크기는 5MB 이하여야 합니다.",
      }));
      return;
    }

    // 파일 타입 검증
    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({
        ...prev,
        avatar: "이미지 파일만 업로드 가능합니다.",
      }));
      return;
    }

    // 이전 preview URL 해제 (메모리 누수 방지)
    if (avatarPreview) {
      URL.revokeObjectURL(avatarPreview);
    }

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    setErrors((prev) => ({
      ...prev,
      avatar: undefined,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 클라이언트 검증
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // 1단계: 회원가입
      const signupData: SignupRequest = {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        community_id: Number(formData.communityId),
        role: "CHALLENGERS",
      };

      await apiPost<SignupResponse>("/api/register", signupData);

      // TODO: 아바타 업로드는 회원가입 후 프로필 설정 페이지에서 처리
      // 현재는 회원가입만 완료하고 로그인 페이지로 이동
      if (avatarFile) {
        console.log("Avatar file selected but will be uploaded after login");
      }

      // 성공 - 로그인 페이지로 리다이렉트
      router.push("/login");
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.code === "EMAIL_DUPLICATED") {
          setErrors({ email: "이미 가입된 이메일입니다." });
        } else if (error.code === "INVALID_PARAM") {
          setErrors({ form: "입력값을 확인해주세요." });
        } else {
          setErrors({ form: error.message });
        }
      } else {
        setErrors({ form: "서버와 연결할 수 없습니다." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    errors,
    isLoading,
    avatarPreview,
    fileInputRef,
    handleChange,
    handleAvatarChange,
    handleSubmit,
  };
}

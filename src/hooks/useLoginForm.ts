import { useState } from "react";
import { useRouter } from "next/navigation";
import { ApiError, apiPost } from "@/lib/api";
import { useAuth } from "@/features/auth/AuthContext";
import type { LoginFormData, LoginErrors, LoginResponse } from "@/types/auth";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function useLoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<LoginErrors>({});

  const validateForm = (): boolean => {
    const newErrors: LoginErrors = {};

    // 이메일 검증
    if (!formData.email) {
      newErrors.email = "이메일을 입력해주세요.";
    } else if (!EMAIL_REGEX.test(formData.email)) {
      newErrors.email = "올바른 이메일 형식이 아닙니다.";
    }

    // 비밀번호 검증
    if (!formData.password) {
      newErrors.password = "비밀번호를 입력해주세요.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));

    // 해당 필드의 에러 클리어
    if (errors[id as keyof LoginErrors]) {
      setErrors((prev) => ({
        ...prev,
        [id]: undefined,
      }));
    }
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
      const response = await apiPost<any>("/api/login", formData);

      // 응답 구조가 다를 수 있으므로 유연하게 처리
      const accessToken =
        response.accessToken ||
        response.token ||
        response.data?.accessToken ||
        response.data?.token;

      if (!accessToken) {
        throw new Error("토큰을 받지 못했습니다.");
      }

      // 사용자 정보 추출
      const { accessToken: _, token: __, data, ...userData } = response;

      // data 필드가 있으면 그 안에 사용자 정보가 있을 수 있음
      const finalUserData = data || userData;

      // Context에 로그인 정보 업데이트
      login(accessToken, finalUserData);

      // 홈으로 리다이렉트
      router.push("/");
    } catch (error) {

      if (error instanceof ApiError) {
        // 401/403/500: 모두 인증 실패로 간주 (백엔드가 500으로 인증 실패를 반환하고 있음)
        if (error.status === 401 || error.status === 403 || error.status >= 500) {
          setErrors({ form: "이메일 또는 비밀번호를 확인해주세요." });
        }
        // 400: 잘못된 요청
        else if (error.status === 400) {
          setErrors({ form: error.message || "입력값을 확인해주세요." });
        }
        // 기타
        else {
          setErrors({ form: error.message || "로그인 중 오류가 발생했습니다." });
        }
      } else if (error instanceof Error) {
        setErrors({ form: error.message });
      } else {
        setErrors({ form: "로그인 중 오류가 발생했습니다." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    errors,
    isLoading,
    handleChange,
    handleSubmit,
  };
}

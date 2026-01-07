import { useState } from "react";
import { useRouter } from "next/navigation";
import { ApiError, apiPost } from "@/lib/api";
import { useCountdown } from "./useCountdown";
import type {
  SignupFormData,
  SignupErrors,
  SignupRequest,
  SignupResponse,
  // EmailVerificationRequest, // Removed as it's no longer used
  EmailVerificationResponse,
  // VerifyCodeRequest, // Removed as it's no longer used (using query params)
  VerifyCodeResponse,
} from "@/types/auth";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function useSignupForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<SignupFormData>({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    communityId: "",
    agreed: false,
    verificationCode: "",
  });
  const [errors, setErrors] = useState<SignupErrors>({});
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const countdown = useCountdown(300);

  // 이메일 인증번호 발송
  const sendVerificationCode = async () => {
    // 이메일 형식 검증
    if (!formData.email) {
      setErrors((prev) => ({ ...prev, email: "이메일을 입력해주세요." }));
      return;
    }
    if (!EMAIL_REGEX.test(formData.email)) {
      setErrors((prev) => ({
        ...prev,
        email: "올바른 이메일 형식이 아닙니다.",
      }));
      return;
    }

    setIsSendingCode(true);
    setErrors((prev) => ({ ...prev, email: undefined }));

    try {
      // Removed requestData object
      // const requestData: EmailVerificationRequest = {
      //   email: formData.email,
      // };

      // Modified apiPost call to use query parameters
      console.log('[DEBUG] Sending email verification request to:', `/api/auth/email?email=${encodeURIComponent(formData.email)}`);
      const response = await apiPost<EmailVerificationResponse>(`/api/auth/email?email=${encodeURIComponent(formData.email)}`);
      console.log('[DEBUG] Email verification response:', response);

      setIsVerificationSent(true);
      countdown.start();
      console.log('[DEBUG] Verification sent state updated successfully');
    } catch (error) {
      console.error('[DEBUG] Email verification error:', error);
      if (error instanceof ApiError) {
        console.error('[DEBUG] ApiError details - code:', error.code, 'message:', error.message, 'status:', error.status);
        setErrors((prev) => ({ ...prev, email: error.message }));
      } else {
        console.error('[DEBUG] Unknown error type:', error);
        setErrors((prev) => ({
          ...prev,
          email: "인증번호 발송에 실패했습니다.",
        }));
      }
    } finally {
      setIsSendingCode(false);
    }
  };

  // 인증번호 검증
  const verifyCode = async () => {
    if (!formData.verificationCode.trim()) {
      setErrors((prev) => ({
        ...prev,
        verificationCode: "인증번호를 입력해주세요.",
      }));
      return;
    }

    setIsVerifying(true);
    setErrors((prev) => ({ ...prev, verificationCode: undefined }));

    try {
      // Modified to use query parameters instead of JSON body
      const endpoint = `/api/auth/verify?email=${encodeURIComponent(formData.email)}&code=${encodeURIComponent(formData.verificationCode)}`;

      console.log('[DEBUG] Verifying code with endpoint:', endpoint);
      const response = await apiPost<VerifyCodeResponse>(endpoint);
      console.log('[DEBUG] Verification response:', response);

      setIsVerified(true);
      countdown.reset();
      console.log('[DEBUG] Verification successful');
    } catch (error) {
      console.error('[DEBUG] Verification error:', error);
      if (error instanceof ApiError) {
        console.error('[DEBUG] ApiError details - code:', error.code, 'message:', error.message, 'status:', error.status);
        setErrors((prev) => ({
          ...prev,
          verificationCode: error.message,
        }));
      } else {
        console.error('[DEBUG] Unknown error type:', error);
        setErrors((prev) => ({
          ...prev,
          verificationCode: "인증번호 확인에 실패했습니다.",
        }));
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: SignupErrors = {};

    // 이메일 검증
    if (!formData.email) {
      newErrors.email = "이메일을 입력해주세요.";
    } else if (!EMAIL_REGEX.test(formData.email)) {
      newErrors.email = "올바른 이메일 형식이 아닙니다.";
    }

    // 이메일 인증 검증
    if (!isVerified) {
      newErrors.verificationCode = "이메일 인증을 완료해주세요.";
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
    handleChange,
    handleSubmit,
    sendVerificationCode,
    verifyCode,
    isVerificationSent,
    isVerified,
    isSendingCode,
    isVerifying,
    countdown,
  };
}

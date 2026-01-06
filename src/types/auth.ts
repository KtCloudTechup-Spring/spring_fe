export interface SignupFormData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  communityId: string;
  agreed: boolean;
  verificationCode: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface LoginErrors {
  email?: string;
  password?: string;
  form?: string;
}

export interface SignupErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  name?: string;
  communityId?: string;
  agreed?: string;
  verificationCode?: string;
  form?: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  name: string;
  community_id: number;
  role: string;
}

export interface SignupResponse {
  token: string;
  userInfo: {
    id: number;
    email: string;
    name: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  userInfo: {
    id: number;
    email: string;
    name: string;
  };
}

export interface Community {
  id: number;
  name: string;
}

// API 에러 응답 타입
export interface ApiErrorResponse {
  code: string; // "EMAIL_DUPLICATED" | "INVALID_PARAM" 등
  message: string;
}

// 이메일 인증 요청/응답 타입
export interface EmailVerificationRequest {
  email: string;
}

export interface EmailVerificationResponse {
  message?: string;
}

export interface VerifyCodeRequest {
  email: string;
  code: string;
}

export interface VerifyCodeResponse {
  message?: string;
}

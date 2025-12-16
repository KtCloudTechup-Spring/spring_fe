import { apiGet, apiPost, apiPut, apiDelete } from "../api";

// 댓글 응답 타입
export interface CommentResponse {
  id: number;
  postId: number;
  userId: number;
  authorName: string;
  authorProfileImage: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

// 댓글 목록 조회 응답 타입
export interface GetCommentsResponse {
  status: number;
  message: string;
  data: {
    totalElements: number;
    totalPages: number;
    size: number;
    content: CommentResponse[];
    number: number;
    first: boolean;
    last: boolean;
    numberOfElements: number;
    empty: boolean;
  };
  timestamp: string;
}

// 단일 댓글 응답 타입
export interface SingleCommentResponse {
  status: number;
  message: string;
  data: CommentResponse;
  timestamp: string;
}

// 댓글 목록 조회
export const getComments = async (postId: string | number): Promise<GetCommentsResponse> => {
  const token = typeof window !== 'undefined' ? localStorage.getItem("accessToken") : null;
  return apiGet<GetCommentsResponse>(`/api/posts/${postId}/comments`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
};

// 댓글 작성
export interface CreateCommentData {
  content: string;
}

export const createComment = async (
  postId: string | number,
  data: CreateCommentData
): Promise<SingleCommentResponse> => {
  const token = typeof window !== 'undefined' ? localStorage.getItem("accessToken") : null;
  return apiPost<SingleCommentResponse>(`/api/posts/${postId}/comments`, data, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
};

// 댓글 수정
export interface UpdateCommentData {
  content: string;
}

export const updateComment = async (
  postId: string | number,
  commentId: string | number,
  data: UpdateCommentData
): Promise<SingleCommentResponse> => {
  const token = typeof window !== 'undefined' ? localStorage.getItem("accessToken") : null;
  return apiPut<SingleCommentResponse>(`/api/posts/${postId}/comments/${commentId}`, data, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
};

// 댓글 삭제
export const deleteComment = async (
  postId: string | number,
  commentId: string | number
): Promise<void> => {
  const token = typeof window !== 'undefined' ? localStorage.getItem("accessToken") : null;
  return apiDelete<void>(`/api/posts/${postId}/comments/${commentId}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
};

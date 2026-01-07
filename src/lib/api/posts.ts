import { apiGet, apiPost, apiDelete } from "../api";

// 게시글 목록 조회
export interface GetPostsParams {
  page?: number;
  size?: number;
  orderBy?: string;
  keyword?: string;
  latestOnly?: boolean;
  courseId?: string;
}

export const getPosts = async () => {
  return apiGet<any>("/posts", {
    // params를 query string으로 변환하는 로직 필요시 추가
  });
};

// 게시글 상세 조회 API 응답 타입
export interface PostDetailResponse {
  status: number;
  message: string;
  data: {
    id: number;
    commentCnt: number;
    authorName: string;
    authorProfileImage: string;
    title: string;
    content: string;
    imageUrl?: string;
    favoriteCount: number;
    favorited: boolean;
    createdAt: string;
    modifiedAt: string;
    communityId?: number;
  };
  timestamp: string;
}

// 게시글 상세 조회
export const getPostById = async (postId: string | number): Promise<PostDetailResponse> => {
  const token = typeof window !== 'undefined' ? localStorage.getItem("accessToken") : null;
  return apiGet<PostDetailResponse>(`/api/posts/${postId}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
};

// 좋아요 토글 API 응답 타입
export interface FavoriteStatusResponse {
  success: boolean;
  status: number;
  message: string;
  data: {
    favorited: boolean;
    favoriteCount: number;
  };
  timestamp: string;
}

// 좋아요 토글
export const toggleFavorite = async (postId: string | number): Promise<FavoriteStatusResponse> => {
  const token = typeof window !== 'undefined' ? localStorage.getItem("accessToken") : null;
  return apiPost<FavoriteStatusResponse>(`/api/posts/${postId}/favorite`, {}, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
};

// 게시글 수정
export const updatePost = async (postId: string | number, formData: FormData) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem("accessToken") : null;

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/${postId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`게시글 수정 실패: ${response.status}`);
  }

  return response.json();
};

// 게시글 삭제
export const deletePost = async (postId: string | number): Promise<void> => {
  const token = typeof window !== 'undefined' ? localStorage.getItem("accessToken") : null;

  console.log("삭제 요청 - postId:", postId);
  console.log("token:", token ? "존재함" : "없음");

  if (!token) {
    throw new Error("인증 토큰이 없습니다. 로그인이 필요합니다.");
  }

  return apiDelete<void>(`/api/posts/${postId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};


import { apiGet, apiPost } from "../api";

// 게시글 목록 조회
export interface GetPostsParams {
  page?: number;
  size?: number;
  orderBy?: string;
  keyword?: string;
  latestOnly?: boolean;
  courseId?: string;
}

export const getPosts = async (params?: GetPostsParams) => {
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
    postTitle: string;
    content: string;
    favoriteCount: number;
    favorited: boolean;
    createdAt: string;
    modifiedAt: string;
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

// 게시글 작성
export interface CreatePostData {
  title: string;
  content: string;
  images?: string[];
}

export const createPost = async (data: CreatePostData) => {
  const response = await http.post("/posts", data);
  return response.data;
};

// 게시글 수정
export interface UpdatePostData {
  title?: string;
  content?: string;
  images?: string[];
}

export const updatePost = async (postId: string | number, data: UpdatePostData) => {
  const response = await http.put(`/posts/${postId}`, data);
  return response.data;
};

// 게시글 삭제
export const deletePost = async (postId: string | number) => {
  const response = await http.delete(`/posts/${postId}`);
  return response.data;
};

// 좋아요 토글
export const toggleLike = async (postId: string | number) => {
  const response = await http.post(`/posts/${postId}/like`);
  return response.data;
};

// 게시글 검색
export interface SearchPostsParams {
  keyword: string;
  filter?: string;
}

export const searchPosts = async (params: SearchPostsParams) => {
  const response = await http.get("/posts/search", { params });
  return response.data;
};

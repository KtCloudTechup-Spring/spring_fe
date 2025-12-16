import http from "../http";

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
  const response = await http.get("/posts", { params });
  return response.data;
};

// 게시글 상세 조회
export const getPostById = async (postId: string | number) => {
  const response = await http.get(`/posts/${postId}`);
  return response.data;
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

import http from "../http";

// 댓글 목록 조회
export const getComments = async (postId: string | number) => {
  const response = await http.get(`/posts/${postId}/comments`);
  return response.data;
};

// 댓글 작성
export interface CreateCommentData {
  content: string;
}

export const createComment = async (postId: string | number, data: CreateCommentData) => {
  const response = await http.post(`/posts/${postId}/comments`, data);
  return response.data;
};

// 댓글 수정
export interface UpdateCommentData {
  content: string;
}

export const updateComment = async (commentId: string | number, data: UpdateCommentData) => {
  const response = await http.put(`/comments/${commentId}`, data);
  return response.data;
};

// 댓글 삭제
export const deleteComment = async (commentId: string | number) => {
  const response = await http.delete(`/comments/${commentId}`);
  return response.data;
};

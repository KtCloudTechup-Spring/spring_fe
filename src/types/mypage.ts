export interface PostResponse {
  id: number;
  communityId: number;
  userId: number;
  userName: string;
  authorProfileImage: string;
  title: string;
  content: string;
  commentCount: number;
  favoriteCount: number;
  favorited: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PagePostResponse {
  totalPages: number;
  totalElements: number;
  size: number;
  content: PostResponse[];
  number: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

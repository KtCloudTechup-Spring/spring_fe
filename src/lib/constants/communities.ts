// 커뮤니티 상수 정의
export interface Community {
  id: number;
  name: string;
  bgColor: string;
  textColor: string;
  iconBgColor: string;
}

export const COMMUNITIES: Community[] = [
  {
    id: 1,
    name: "풀스택",
    bgColor: "bg-blue-50",
    textColor: "text-blue-700",
    iconBgColor: "bg-blue-500",
  },
  {
    id: 2,
    name: "프론트엔드",
    bgColor: "bg-cyan-50",
    textColor: "text-cyan-700",
    iconBgColor: "bg-cyan-500",
  },
  {
    id: 3,
    name: "백엔드",
    bgColor: "bg-green-50",
    textColor: "text-green-700",
    iconBgColor: "bg-green-500",
  },
  {
    id: 4,
    name: "생성형 AI",
    bgColor: "bg-purple-50",
    textColor: "text-purple-700",
    iconBgColor: "bg-purple-500",
  },
  {
    id: 5,
    name: "사이버 보안",
    bgColor: "bg-red-50",
    textColor: "text-red-700",
    iconBgColor: "bg-red-500",
  },
  {
    id: 6,
    name: "클라우드 인프라",
    bgColor: "bg-orange-50",
    textColor: "text-orange-700",
    iconBgColor: "bg-orange-500",
  },
  {
    id: 7,
    name: "클라우드 네이티브",
    bgColor: "bg-amber-50",
    textColor: "text-amber-700",
    iconBgColor: "bg-amber-500",
  },
  {
    id: 8,
    name: "프로덕트 디자인",
    bgColor: "bg-pink-50",
    textColor: "text-pink-700",
    iconBgColor: "bg-pink-500",
  },
  {
    id: 9,
    name: "프로덕트 매니지먼트",
    bgColor: "bg-indigo-50",
    textColor: "text-indigo-700",
    iconBgColor: "bg-indigo-500",
  },
];

// ID로 커뮤니티 찾기
export const getCommunityById = (id: number): Community | undefined => {
  return COMMUNITIES.find((community) => community.id === id);
};

// 이름으로 커뮤니티 찾기
export const getCommunityByName = (name: string): Community | undefined => {
  return COMMUNITIES.find((community) => community.name === name);
};

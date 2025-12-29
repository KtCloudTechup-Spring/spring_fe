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
    bgColor: "bg-blue-500",
    textColor: "text-white",
    iconBgColor: "bg-blue-600",
  },
  {
    id: 2,
    name: "프론트엔드",
    bgColor: "bg-purple-500",
    textColor: "text-white",
    iconBgColor: "bg-purple-600",
  },
  {
    id: 3,
    name: "백엔드",
    bgColor: "bg-orange-500",
    textColor: "text-white",
    iconBgColor: "bg-orange-600",
  },
  {
    id: 4,
    name: "생성형 AI",
    bgColor: "bg-indigo-500",
    textColor: "text-white",
    iconBgColor: "bg-indigo-600",
  },
  {
    id: 5,
    name: "사이버 보안",
    bgColor: "bg-slate-600",
    textColor: "text-white",
    iconBgColor: "bg-slate-700",
  },
  {
    id: 6,
    name: "클라우드 인프라",
    bgColor: "bg-orange-500",
    textColor: "text-white",
    iconBgColor: "bg-orange-600",
  },
  {
    id: 7,
    name: "클라우드 네이티브",
    bgColor: "bg-lime-500",
    textColor: "text-white",
    iconBgColor: "bg-lime-600",
  },
  {
    id: 8,
    name: "프로덕트 디자인",
    bgColor: "bg-pink-500",
    textColor: "text-white",
    iconBgColor: "bg-pink-600",
  },
  {
    id: 9,
    name: "프로덕트 매니지먼트",
    bgColor: "bg-green-500",
    textColor: "text-white",
    iconBgColor: "bg-green-600",
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

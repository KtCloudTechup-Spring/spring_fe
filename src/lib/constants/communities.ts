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
    bgColor: "bg-blue-100",
    textColor: "text-blue-600",
    iconBgColor: "bg-blue-100",
  },
  {
    id: 2,
    name: "프론트엔드",
    bgColor: "bg-purple-100",
    textColor: "text-purple-600",
    iconBgColor: "bg-purple-100",
  },
  {
    id: 3,
    name: "백엔드",
    bgColor: "bg-orange-100",
    textColor: "text-orange-600",
    iconBgColor: "bg-orange-100",
  },
  {
    id: 4,
    name: "생성형 AI",
    bgColor: "bg-indigo-100",
    textColor: "text-indigo-600",
    iconBgColor: "bg-indigo-100",
  },
  {
    id: 5,
    name: "사이버 보안",
    bgColor: "bg-slate-200",
    textColor: "text-slate-700",
    iconBgColor: "bg-slate-200",
  },
  {
    id: 6,
    name: "클라우드 인프라",
    bgColor: "bg-orange-100",
    textColor: "text-orange-600",
    iconBgColor: "bg-orange-100",
  },
  {
    id: 7,
    name: "클라우드 네이티브",
    bgColor: "bg-lime-100",
    textColor: "text-lime-600",
    iconBgColor: "bg-lime-100",
  },
  {
    id: 8,
    name: "프로덕트 디자인",
    bgColor: "bg-pink-100",
    textColor: "text-pink-600",
    iconBgColor: "bg-pink-100",
  },
  {
    id: 9,
    name: "프로덕트 매니지먼트",
    bgColor: "bg-green-100",
    textColor: "text-green-600",
    iconBgColor: "bg-green-100",
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

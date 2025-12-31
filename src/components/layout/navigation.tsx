"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ChevronDown,
  Search,
  X,
  Globe,
  Code,
  Server,
  Bot,
  ShieldCheck,
  Cloud,
  Box,
  Palette,
  Lightbulb,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { COMMUNITIES } from "@/lib/constants/communities";
import { Card } from "@/components/ui/card";

interface SearchResult {
  id: number;
  postTitle?: string;
  title?: string;
  content: string;
  authorName: string;
  createdAt: string;
  favoriteCount: number;
  commentCount: number;
  communityId: number;
}

export default function Navigation() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearchClosing, setIsSearchClosing] = useState(false);
  const allCategory = { id: 0, name: "전체", bgColor: "bg-slate-500", textColor: "text-white", iconBgColor: "bg-slate-600" };
  const [selectedCommunity, setSelectedCommunity] = useState(allCategory); // 기본값: 전체
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // 디바운싱을 위한 useEffect
  useEffect(() => {
    // 검색어가 비어있으면 결과 초기화
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    // 300ms 후에 자동으로 검색 실행
    const debounceTimer = setTimeout(() => {
      handleSearch();
    }, 300);

    // 클린업: 새로운 입력이 들어오면 이전 타이머 취소
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, selectedCommunity]); // searchQuery나 selectedCommunity가 변경될 때마다 실행

  // 외부 클릭 감지를 위한 useEffect
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        if (isSearchOpen) {
          handleCloseSearch();
        }
      }
    };

    // 검색창이 열려있을 때만 이벤트 리스너 추가
    if (isSearchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchOpen]);

  // 검색 실행 함수
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const token = localStorage.getItem("accessToken");

      // 전체 선택 시 모든 커뮤니티 검색
      if (selectedCommunity.id === 0) {
        const communityIds = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        const fetchPromises = communityIds.map((id) =>
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/community/${id}?q=${encodeURIComponent(searchQuery)}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              ...(token && { Authorization: `Bearer ${token}` }),
            },
          })
            .then((res) => (res.ok ? res.json() : null))
            .catch(() => null)
        );

        const responses = await Promise.all(fetchPromises);
        const allPosts = responses
          .filter((res) => res && res.data?.content)
          .flatMap((res) => res.data.content);

        // 최신순 정렬
        const sortedPosts = allPosts.sort((a: any, b: any) => {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return dateB - dateA;
        });

        setSearchResults(sortedPosts);
      } else {
        // 특정 커뮤니티 검색
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/posts/community/${selectedCommunity.id}?q=${encodeURIComponent(searchQuery)}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              ...(token && { Authorization: `Bearer ${token}` }),
            },
          }
        );

        if (response.ok) {
          const result = await response.json();
          const posts = result.data?.content || [];
          setSearchResults(posts);
        } else {
          setSearchResults([]);
        }
      }
    } catch (error) {
      console.error("검색 실패:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // 엔터키로 검색 실행
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // 검색창 닫기 핸들러
  const handleCloseSearch = () => {
    setIsSearchClosing(true);
    setTimeout(() => {
      setIsSearchOpen(false);
      setIsSearchClosing(false);
      setSearchQuery("");
      setSearchResults([]);
    }, 200); // 애니메이션 시간과 맞춤
  };

  return (
    <header className="w-full border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-[1200px] mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link href="/">
            <h1 className="text-xl font-bold text-slate-900 cursor-pointer hover:text-slate-700 transition-colors shrink-0">
              TechUp Challenger Hub
            </h1>
          </Link>

          {!isSearchOpen && (
            <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
              {/* [0] 전체 보기 */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1 hover:text-slate-900 transition-colors outline-none">
                    전체 보기 <ChevronDown className="w-4 h-4" />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-64 p-2" align="start">
                  <DropdownMenuLabel className="text-xs text-gray-500 font-normal mb-1">
                    모든 커뮤니티
                  </DropdownMenuLabel>

                  <Link href="/community?category=1">
                    <DropdownMenuItem className="cursor-pointer p-2 flex items-center gap-3 focus:bg-slate-50 focus:text-slate-900 rounded-md">
                      <div className="p-2 bg-blue-100 text-blue-600 rounded-full shrink-0">
                        <Globe className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-bold">풀스택</span>
                    </DropdownMenuItem>
                  </Link>

                  <DropdownMenuSeparator className="my-1" />

                  <Link href="/community?category=2">
                    <DropdownMenuItem className="cursor-pointer p-2 flex items-center gap-3 focus:bg-slate-50 focus:text-slate-900 rounded-md">
                      <div className="p-2 bg-purple-100 text-purple-600 rounded-full shrink-0">
                        <Code className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-bold">프론트엔드</span>
                    </DropdownMenuItem>
                  </Link>

                  <DropdownMenuSeparator className="my-1" />

                  <Link href="/community?category=3">
                    <DropdownMenuItem className="cursor-pointer p-2 flex items-center gap-3 focus:bg-slate-50 focus:text-slate-900 rounded-md">
                      <div className="p-2 bg-orange-100 text-orange-600 rounded-full shrink-0">
                        <Server className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-bold">백엔드</span>
                    </DropdownMenuItem>
                  </Link>

                  <DropdownMenuSeparator className="my-1" />

                  <Link href="/community?category=4">
                    <DropdownMenuItem className="cursor-pointer p-2 flex items-center gap-3 focus:bg-slate-50 focus:text-slate-900 rounded-md">
                      <div className="p-2 bg-indigo-100 text-indigo-600 rounded-full shrink-0">
                        <Bot className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-bold">생성형 AI</span>
                    </DropdownMenuItem>
                  </Link>

                  <DropdownMenuSeparator className="my-1" />

                  <Link href="/community?category=5">
                    <DropdownMenuItem className="cursor-pointer p-2 flex items-center gap-3 focus:bg-slate-50 focus:text-slate-900 rounded-md">
                      <div className="p-2 bg-slate-200 text-slate-700 rounded-full shrink-0">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-bold">사이버 보안</span>
                    </DropdownMenuItem>
                  </Link>

                  <DropdownMenuSeparator className="my-1" />

                  <Link href="/community?category=6">
                    <DropdownMenuItem className="cursor-pointer p-2 flex items-center gap-3 focus:bg-slate-50 focus:text-slate-900 rounded-md">
                      <div className="p-2 bg-orange-100 text-orange-600 rounded-full shrink-0">
                        <Cloud className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-bold">클라우드 인프라</span>
                    </DropdownMenuItem>
                  </Link>

                  <DropdownMenuSeparator className="my-1" />

                  <Link href="/community?category=7">
                    <DropdownMenuItem className="cursor-pointer p-2 flex items-center gap-3 focus:bg-slate-50 focus:text-slate-900 rounded-md">
                      <div className="p-2 bg-lime-100 text-lime-600 rounded-full shrink-0">
                        <Box className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-bold">클라우드 네이티브</span>
                    </DropdownMenuItem>
                  </Link>

                  <DropdownMenuSeparator className="my-1" />

                  <Link href="/community?category=8">
                    <DropdownMenuItem className="cursor-pointer p-2 flex items-center gap-3 focus:bg-slate-50 focus:text-slate-900 rounded-md">
                      <div className="p-2 bg-pink-100 text-pink-600 rounded-full shrink-0">
                        <Palette className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-bold">프로덕트 디자인</span>
                    </DropdownMenuItem>
                  </Link>

                  <DropdownMenuSeparator className="my-1" />

                  <Link href="/community?category=9">
                    <DropdownMenuItem className="cursor-pointer p-2 flex items-center gap-3 focus:bg-slate-50 focus:text-slate-900 rounded-md">
                      <div className="p-2 bg-green-100 text-green-600 rounded-full shrink-0">
                        <Lightbulb className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-bold">프로덕트 매니지먼트</span>
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* [1] 웹 개발 */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1 hover:text-slate-900 transition-colors outline-none">
                    웹 개발 <ChevronDown className="w-4 h-4" />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-64 p-2" align="start">
                  <DropdownMenuLabel className="text-xs text-gray-500 font-normal mb-1">
                    웹 개발 과정
                  </DropdownMenuLabel>

                  <Link href="/community?category=1">
                    <DropdownMenuItem className="cursor-pointer p-2 flex items-center gap-3 focus:bg-slate-50 focus:text-slate-900 rounded-md">
                      <div className="p-2 bg-blue-100 text-blue-600 rounded-full shrink-0">
                        <Globe className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-bold">풀스택</span>
                    </DropdownMenuItem>
                  </Link>

                  <DropdownMenuSeparator className="my-1" />

                  <Link href="/community?category=2">
                    <DropdownMenuItem className="cursor-pointer p-2 flex items-center gap-3 focus:bg-slate-50 focus:text-slate-900 rounded-md">
                      <div className="p-2 bg-purple-100 text-purple-600 rounded-full shrink-0">
                        <Code className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-bold">프론트엔드</span>
                    </DropdownMenuItem>
                  </Link>

                  <DropdownMenuSeparator className="my-1" />

                  <Link href="/community?category=3">
                    <DropdownMenuItem className="cursor-pointer p-2 flex items-center gap-3 focus:bg-slate-50 focus:text-slate-900 rounded-md">
                      <div className="p-2 bg-orange-100 text-orange-600 rounded-full shrink-0">
                        <Server className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-bold">백엔드</span>
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* [2] 인프라 */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1 hover:text-slate-900 transition-colors outline-none">
                    인프라 / 혁신 기술 <ChevronDown className="w-4 h-4" />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-64 p-2" align="start">
                  <DropdownMenuLabel className="text-xs text-gray-500 font-normal mb-1">
                    인프라 및 혁신 과정
                  </DropdownMenuLabel>

                  <Link href="/community?category=4">
                    <DropdownMenuItem className="cursor-pointer p-2 flex items-center gap-3 focus:bg-slate-50 focus:text-slate-900 rounded-md">
                      <div className="p-2 bg-indigo-100 text-indigo-600 rounded-full shrink-0">
                        <Bot className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-bold">생성형 AI</span>
                    </DropdownMenuItem>
                  </Link>

                  <DropdownMenuSeparator className="my-1" />

                  <Link href="/community?category=5">
                    <DropdownMenuItem className="cursor-pointer p-2 flex items-center gap-3 focus:bg-slate-50 focus:text-slate-900 rounded-md">
                      <div className="p-2 bg-slate-200 text-slate-700 rounded-full shrink-0">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-bold">사이버 보안</span>
                    </DropdownMenuItem>
                  </Link>

                  <DropdownMenuSeparator className="my-1" />

                  <Link href="/community?category=6">
                    <DropdownMenuItem className="cursor-pointer p-2 flex items-center gap-3 focus:bg-slate-50 focus:text-slate-900 rounded-md">
                      <div className="p-2 bg-orange-100 text-orange-600 rounded-full shrink-0">
                        <Cloud className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-bold">클라우드 인프라</span>
                    </DropdownMenuItem>
                  </Link>

                  <DropdownMenuSeparator className="my-1" />

                  <Link href="/community?category=7">
                    <DropdownMenuItem className="cursor-pointer p-2 flex items-center gap-3 focus:bg-slate-50 focus:text-slate-900 rounded-md">
                      <div className="p-2 bg-lime-100 text-lime-600 rounded-full shrink-0">
                        <Box className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-bold">
                        클라우드 네이티브
                      </span>
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* [3] 프로덕트 */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1 hover:text-slate-900 transition-colors outline-none">
                    프로덕트 전문가 <ChevronDown className="w-4 h-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 p-2" align="start">
                  <DropdownMenuLabel className="text-xs text-gray-500 font-normal mb-1">
                    기획 및 디자인 과정
                  </DropdownMenuLabel>

                  <Link href="/community?category=8">
                    <DropdownMenuItem className="cursor-pointer p-2 flex items-center gap-3 focus:bg-slate-50 focus:text-slate-900 rounded-md">
                      <div className="p-2 bg-pink-100 text-pink-600 rounded-full shrink-0">
                        <Palette className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-bold">프로덕트 디자인</span>
                    </DropdownMenuItem>
                  </Link>

                  <DropdownMenuSeparator className="my-1" />

                  <Link href="/community?category=9">
                    <DropdownMenuItem className="cursor-pointer p-2 flex items-center gap-3 focus:bg-slate-50 focus:text-slate-900 rounded-md">
                      <div className="p-2 bg-green-100 text-green-600 rounded-full shrink-0">
                        <Lightbulb className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-bold">
                        프로덕트 매니지먼트
                      </span>
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>
          )}
        </div>

        {isSearchOpen ? (
          <div
            ref={searchContainerRef}
            className={`flex-1 flex items-center justify-end ml-4 transition-all duration-200 ${
            isSearchClosing ? 'animate-out fade-out' : 'animate-in fade-in'
          }`}>
            <div className="relative w-full max-w-md">
              {/* 검색 입력창 (카테고리 드롭다운 포함) */}
              <div className="relative flex items-center bg-gray-100 rounded-full focus-within:ring-2 focus-within:ring-slate-900">
                {/* 커뮤니티 선택 드롭다운 */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-1.5 pl-3 pr-2 py-2 hover:bg-gray-200 rounded-l-full transition-colors outline-none shrink-0 border-r border-gray-300">
                      <div className={`${selectedCommunity.iconBgColor} p-1 rounded-full`}>
                        {selectedCommunity.id === 0 ? (
                          <Search className="w-3 h-3 text-white" />
                        ) : (() => {
                          const iconMap: { [key: number]: any } = {
                            1: Globe,
                            2: Code,
                            3: Server,
                            4: Bot,
                            5: ShieldCheck,
                            6: Cloud,
                            7: Box,
                            8: Palette,
                            9: Lightbulb,
                          };
                          const IconComponent = iconMap[selectedCommunity.id];
                          return IconComponent ? <IconComponent className="w-3 h-3 text-white" /> : null;
                        })()}
                      </div>
                      <span className="text-xs font-medium text-gray-700 max-w-[60px] truncate">{selectedCommunity.name}</span>
                      <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 p-2" align="start">
                    <DropdownMenuLabel className="text-xs text-gray-500 font-normal mb-1">
                      검색할 커뮤니티 선택
                    </DropdownMenuLabel>

                    {/* 전체 옵션 */}
                    <DropdownMenuItem
                      className="cursor-pointer p-2 flex items-center gap-3 focus:bg-slate-50 focus:text-slate-900 rounded-md"
                      onClick={() => setSelectedCommunity(allCategory)}
                    >
                      <div className={`${allCategory.iconBgColor} p-2 rounded-full shrink-0`}>
                        <Search className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-bold">{allCategory.name}</span>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="my-1" />

                    {/* 커뮤니티 목록 */}
                    {COMMUNITIES.map((community, index) => {
                      const iconMap: { [key: number]: any } = {
                        1: Globe,
                        2: Code,
                        3: Server,
                        4: Bot,
                        5: ShieldCheck,
                        6: Cloud,
                        7: Box,
                        8: Palette,
                        9: Lightbulb,
                      };
                      const IconComponent = iconMap[community.id];

                      return (
                        <div key={community.id}>
                          {index > 0 && <DropdownMenuSeparator className="my-1" />}
                          <DropdownMenuItem
                            className="cursor-pointer p-2 flex items-center gap-3 focus:bg-slate-50 focus:text-slate-900 rounded-md"
                            onClick={() => setSelectedCommunity(community)}
                          >
                            <div className={`${community.iconBgColor} p-2 rounded-full shrink-0`}>
                              {IconComponent && <IconComponent className="w-4 h-4 text-white" />}
                            </div>
                            <span className="text-sm font-bold">{community.name}</span>
                          </DropdownMenuItem>
                        </div>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* 검색 입력 필드 */}
                <input
                  type="text"
                  placeholder="검색어를 입력하세요"
                  className="flex-1 bg-transparent text-sm py-2 pl-3 pr-4 outline-none"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>
            </div>

            {/* 검색 결과 드롭다운 */}
            {isSearchOpen && searchQuery && (
              <div className="absolute top-full left-0 right-0 mt-2 max-w-[1200px] mx-auto px-4">
                <Card className="max-h-[500px] overflow-y-auto shadow-lg">
                  {isSearching ? (
                    <div className="p-6 text-center text-gray-500">
                      <p>검색 중...</p>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="divide-y">
                      {searchResults.map((post) => {
                        const community = COMMUNITIES.find(c => c.id === post.communityId);
                        const postTitle = post.title || post.postTitle || "제목 없음";

                        return (
                          <Link
                            key={post.id}
                            href={`/community/${post.id}`}
                            onClick={handleCloseSearch}
                          >
                            <div className="p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                              <div className="flex items-start justify-between gap-3 mb-1">
                                <h4 className="font-bold text-gray-900 flex-1">{postTitle}</h4>
                                {community && (
                                  <span className={`text-xs ${community.bgColor} ${community.textColor} px-2.5 py-1 rounded-full whitespace-nowrap shrink-0`}>
                                    {community.name}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 line-clamp-2 mb-2">{post.content}</p>
                              <div className="flex items-center gap-3 text-xs text-gray-400">
                                <span className="text-gray-700">{post.authorName}</span>
                                <span>·</span>
                                <span>{new Date(post.createdAt).toLocaleDateString("ko-KR")}</span>
                                <span>·</span>
                                <span>좋아요 {post.favoriteCount}</span>
                                <span>·</span>
                                <span>댓글 {post.commentCount}</span>
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-6 text-center text-gray-500">
                      <p>"{searchQuery}"에 대한 검색 결과가 없습니다.</p>
                      <p className="text-xs mt-1">다른 검색어를 입력해보세요.</p>
                    </div>
                  )}
                </Card>
              </div>
            )}
            <button
              onClick={handleCloseSearch}
              className="ml-3 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Search className="w-5 h-5 text-gray-400 hover:text-slate-900" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

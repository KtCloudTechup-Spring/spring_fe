"use client";

import { useState } from "react";
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

export default function Navigation() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

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
          <div className="flex-1 flex items-center justify-end ml-4 animate-in fade-in duration-200">
            <div className="relative w-full max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="검색어를 입력하세요 (예: React, AI)"
                className="w-full bg-gray-100 text-sm py-2 pl-10 pr-4 rounded-full focus:outline-none focus:ring-2 focus:ring-slate-900"
                autoFocus
              />
            </div>
            <button
              onClick={() => setIsSearchOpen(false)}
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

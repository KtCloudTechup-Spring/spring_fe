"use client";

import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";

export default function MyChatsTab() {
  return (
    <Card>
      <CardContent className="py-16">
        <div className="text-center text-gray-500 space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
              <MessageCircle className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          <div>
            <p className="font-medium">채팅 기능 준비 중</p>
            <p className="text-sm mt-2">곧 만나요!</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

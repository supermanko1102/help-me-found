"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [keyword, setKeyword] = useState("");
  const router = useRouter();

  const handleRecommend = () => {
    router.push(`/recommend?keyword=${encodeURIComponent(keyword)}`);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="w-full max-w-xs space-y-4">
        <Input
          type="text"
          placeholder="輸入關鍵字（選填）"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <Button onClick={handleRecommend} className="w-full">
          獲取推薦餐廳
        </Button>
      </div>
    </main>
  );
}

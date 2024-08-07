import { Suspense } from "react";
import RecommendContent from "@/components/RecommendContent";

export default function RecommendPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <Suspense fallback={<div>載入中...</div>}>
        <RecommendContent />
      </Suspense>
    </main>
  );
}

// 這個函數告訴 Next.js 在構建時不要預渲染這個頁面
export const dynamic = "force-dynamic";

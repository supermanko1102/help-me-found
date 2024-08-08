// app/page.tsx

import React from "react";
import AutoLocationForm from "@/components/AutoLocationForm";

export default function HomePage() {
  return (
    <div className="text-center">
      <p className="mb-6">點擊下方按鈕，我們將為您推薦附近的餐廳。</p>
      <AutoLocationForm />
    </div>
  );
}

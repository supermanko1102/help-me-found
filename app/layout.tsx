// app/layout.tsx

import React from "react";
import { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "附近餐廳推薦",
  description: "自動推薦您附近的優質餐廳",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW">
      <body>
        <main className="container mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}

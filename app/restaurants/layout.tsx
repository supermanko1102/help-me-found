// app/restaurants/layout.tsx

import React from "react";
import FilterSidebar from "@/components/FilterSiderbar";

export default function RestaurantsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row">
      <FilterSidebar />
      <div className="flex-grow">{children}</div>
    </div>
  );
}

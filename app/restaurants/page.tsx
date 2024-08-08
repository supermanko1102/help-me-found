// app/restaurants/page.tsx
"use client";

import React, { useState, useCallback } from "react";
import { getRecommendedRestaurants } from "@/lib/restaurants";
import RestaurantList from "@/components/RestaurantList";
import { Coordinates } from "@/types";
import { Button } from "@/components/ui/button";

interface PageProps {
  searchParams: {
    latitude?: string;
    longitude?: string;
  };
}

export default function RestaurantsPage({ searchParams }: PageProps) {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { latitude, longitude } = searchParams;

  const fetchRestaurants = useCallback(async () => {
    if (!latitude || !longitude) {
      setError("請提供位置信息");
      return;
    }

    const parsedLat = parseFloat(latitude);
    const parsedLng = parseFloat(longitude);

    if (isNaN(parsedLat) || isNaN(parsedLng)) {
      setError("無效的位置信息");
      return;
    }

    const coordinates: Coordinates = {
      latitude: parsedLat,
      longitude: parsedLng,
    };

    setLoading(true);
    setError(null);

    try {
      const recommendedRestaurants = await getRecommendedRestaurants(
        coordinates
      );
      setRestaurants(recommendedRestaurants);
    } catch (error) {
      console.error("Error fetching recommended restaurants:", error);
      setError("獲取餐廳推薦時出錯，請稍後再試");
    } finally {
      setLoading(false);
    }
  }, [latitude, longitude]);

  React.useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

  const handleRecommendAgain = () => {
    fetchRestaurants();
  };

  if (error) {
    return <div className="text-center text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">推薦餐廳</h1>
        <Button onClick={handleRecommendAgain} disabled={loading}>
          {loading ? "加載中..." : "再次推薦"}
        </Button>
      </div>
      {loading ? (
        <div className="text-center">加載中...</div>
      ) : (
        <RestaurantList restaurants={restaurants} />
      )}
    </div>
  );
}

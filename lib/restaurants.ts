// lib/restaurants.ts
import { db } from "./firebase";
import {
  collection,
  query,
  getDocs,
  GeoPoint,
  writeBatch,
  doc,
} from "firebase/firestore";
import axios from "axios";
import { Coordinates } from "@/types";

interface Restaurant {
  id: string;
  placeId: string;
  name: string;
  address: string;
  location: GeoPoint | { latitude: number; longitude: number };
  rating: number;
  priceLevel: number;
  image: string | null;
  types: string[];
  recommendationScore?: number;
}

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // 地球半徑（公里）
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
function getRestaurantCoordinates(restaurant: Restaurant): {
  latitude: number;
  longitude: number;
} {
  if (restaurant.location instanceof GeoPoint) {
    return {
      latitude: restaurant.location.latitude,
      longitude: restaurant.location.longitude,
    };
  } else if (
    typeof restaurant.location === "object" &&
    restaurant.location !== null
  ) {
    return {
      latitude: restaurant.location.latitude,
      longitude: restaurant.location.longitude,
    };
  }
  // 如果無法獲取位置，返回一個默認值或拋出錯誤
  console.error("Invalid location data for restaurant:", restaurant.name);
  return { latitude: 0, longitude: 0 };
}

function calculateRecommendationScore(
  restaurant: Restaurant,
  userLat: number,
  userLon: number
): number {
  const { latitude, longitude } = getRestaurantCoordinates(restaurant);
  const distance = calculateDistance(userLat, userLon, latitude, longitude);
  const distanceScore = Math.max(0, 1 - distance / 5); // 假設5公里內為最佳
  const ratingScore = restaurant.rating / 5;
  const priceScore = 1 - ((restaurant.priceLevel || 1) - 1) / 4; // 假設價格範圍是1-5，如果沒有價格信息，默認為1

  // 可以根據需要調整這些權重
  const distanceWeight = 0.4;
  const ratingWeight = 0.4;
  const priceWeight = 0.2;

  return (
    distanceScore * distanceWeight +
    ratingScore * ratingWeight +
    priceScore * priceWeight
  );
}
function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
export async function getRecommendedRestaurants(
  coordinates: Coordinates
): Promise<Restaurant[]> {
  const { latitude, longitude } = coordinates;

  const restaurantsRef = collection(db, "restaurants");
  const q = query(restaurantsRef);

  try {
    const querySnapshot = await getDocs(q);
    let restaurants: Restaurant[] = querySnapshot.docs.map((doc) => {
      const data = doc.data() as Omit<Restaurant, "id">;
      return { id: doc.id, ...data };
    });

    // 過濾掉沒有有效位置數據的餐廳
    restaurants = restaurants.filter(
      (restaurant) => getRestaurantCoordinates(restaurant) !== null
    );

    // 計算推薦分數
    restaurants.forEach((restaurant) => {
      restaurant.recommendationScore = calculateRecommendationScore(
        restaurant,
        latitude,
        longitude
      );
    });

    // 添加一些隨機性
    const randomFactor = Math.random() * 0.2 - 0.1; // -0.1 到 0.1 之間的隨機數
    restaurants.forEach((restaurant) => {
      restaurant.recommendationScore =
        (restaurant.recommendationScore || 0) + randomFactor;
    });

    // 排序並選擇前 50% 的餐廳
    restaurants.sort(
      (a, b) => (b.recommendationScore || 0) - (a.recommendationScore || 0)
    );
    const topHalf = restaurants.slice(0, Math.ceil(restaurants.length / 2));

    // 隨機打亂前 50% 的餐廳
    const shuffledTopHalf = shuffleArray(topHalf);

    // 按類型分組並每組選擇top 3
    const categorizedRestaurants: { [key: string]: Restaurant[] } = {};
    shuffledTopHalf.forEach((restaurant) => {
      const mainType =
        restaurant.types && restaurant.types.length > 0
          ? restaurant.types[0]
          : "Other";
      if (!categorizedRestaurants[mainType]) {
        categorizedRestaurants[mainType] = [];
      }
      if (categorizedRestaurants[mainType].length < 3) {
        categorizedRestaurants[mainType].push(restaurant);
      }
    });

    // 將分類後的結果轉換回數組並再次隨機打亂
    return shuffleArray(Object.values(categorizedRestaurants).flat());
  } catch (error) {
    console.error("Error in getRecommendedRestaurants:", error);
    throw error;
  }
}

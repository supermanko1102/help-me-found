"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useJsApiLoader, GoogleMap, Marker } from "@react-google-maps/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Restaurant {
  name: string;
  vicinity: string;
  rating: number;
  location: google.maps.LatLngLiteral;
  distance: number;
}

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

export default function RecommendContent() {
  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword");
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [userLocation, setUserLocation] =
    useState<google.maps.LatLngLiteral | null>(null);
  const [loading, setLoading] = useState(true);
  const [recommendedRestaurants, setRecommendedRestaurants] = useState<
    Set<string>
  >(new Set());

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ["places", "geometry"],
  });

  const getCurrentPosition = useCallback(() => {
    return new Promise<google.maps.LatLngLiteral>((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          () => {
            reject(new Error("無法獲取您的位置"));
          }
        );
      } else {
        reject(new Error("您的瀏覽器不支持地理位置"));
      }
    });
  }, []);

  const recommendRestaurants = useCallback(
    (location: google.maps.LatLngLiteral) => {
      const service = new google.maps.places.PlacesService(
        document.createElement("div")
      );
      let radius = 1000; // 初始搜索範圍 1 公里

      const searchRestaurants = () => {
        const request: google.maps.places.PlaceSearchRequest = {
          location: location,
          radius: radius,
          type: "restaurant",
          keyword: keyword || undefined,
        };

        service.nearbySearch(request, (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            // 過濾掉已推薦過的餐廳
            const availableRestaurants = results.filter(
              (restaurant) => !recommendedRestaurants.has(restaurant.place_id!)
            );

            if (availableRestaurants.length > 0) {
              // 隨機選擇最多3家餐廳
              const selectedRestaurants = [];
              for (
                let i = 0;
                i < Math.min(3, availableRestaurants.length);
                i++
              ) {
                const index = Math.floor(
                  Math.random() * availableRestaurants.length
                );
                const restaurant = availableRestaurants.splice(index, 1)[0];
                selectedRestaurants.push(restaurant);
                setRecommendedRestaurants((prev) =>
                  new Set(prev).add(restaurant.place_id!)
                );
              }

              const newRestaurants = selectedRestaurants.map((restaurant) => {
                const restaurantLocation =
                  restaurant.geometry?.location?.toJSON() || location;
                const distance =
                  google.maps.geometry.spherical.computeDistanceBetween(
                    new google.maps.LatLng(location),
                    new google.maps.LatLng(restaurantLocation)
                  );

                return {
                  name: restaurant.name || "未知餐廳",
                  vicinity: restaurant.vicinity || "位置未知",
                  rating: restaurant.rating || 0,
                  location: restaurantLocation,
                  distance: distance,
                };
              });

              setRestaurants(newRestaurants);
              setLoading(false);
            } else if (radius < 5000) {
              // 如果在 5 公里內沒有新餐廳，則擴大搜索範圍
              radius += 1000;
              searchRestaurants();
            } else {
              // 如果擴大到 5 公里仍無新餐廳，則重置已推薦列表
              setRecommendedRestaurants(new Set());
              radius = 1000;
              searchRestaurants();
            }
          } else {
            console.error("無法找到餐廳");
            setLoading(false);
          }
        });
      };

      searchRestaurants();
    },
    [keyword, recommendedRestaurants]
  );

  useEffect(() => {
    if (isLoaded && !userLocation) {
      getCurrentPosition()
        .then((location) => {
          setUserLocation(location);
          return location;
        })
        .then(recommendRestaurants)
        .catch((error) => {
          console.error(error);
          setLoading(false);
        });
    }
  }, [isLoaded, getCurrentPosition, recommendRestaurants, userLocation]);

  const handleNewRecommendation = () => {
    setLoading(true);
    if (userLocation) {
      recommendRestaurants(userLocation);
    }
  };

  if (loadError) {
    return <div>地圖加載錯誤</div>;
  }

  if (!isLoaded || loading) {
    return <div>正在為您尋找推薦餐廳...</div>;
  }

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">推薦餐廳</h1>
      {restaurants.length > 0 ? (
        <>
          {restaurants.map((restaurant, index) => (
            <Card key={index} className="w-full max-w-md mb-4">
              <CardHeader>
                <CardTitle>{restaurant.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>地址：{restaurant.vicinity}</p>
                <p>評分：{restaurant.rating.toFixed(1)} ⭐</p>
                <p>距離：{(restaurant.distance / 1000).toFixed(2)} 公里</p>
              </CardContent>
            </Card>
          ))}
          <div className="w-full max-w-md mb-4">
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={restaurants[0].location}
              zoom={13}
            >
              {restaurants.map((restaurant, index) => (
                <Marker key={index} position={restaurant.location} />
              ))}
            </GoogleMap>
          </div>
        </>
      ) : (
        <p>抱歉，無法找到符合條件的餐廳。</p>
      )}
      <Button onClick={handleNewRecommendation} className="mt-4">
        再次推薦
      </Button>
    </>
  );
}

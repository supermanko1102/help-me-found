import React from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Restaurant {
  id: string;
  placeId: string;
  name: string;
  address: string;
  rating: number;
  priceLevel?: number;
  image: string | null;
  recommendationScore?: number;
  types?: string[];
}

interface RestaurantListProps {
  restaurants: Restaurant[];
}

const RestaurantList: React.FC<RestaurantListProps> = ({ restaurants }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {restaurants.map((restaurant) => (
        <Card key={restaurant.id} className="overflow-hidden">
          <div className="relative h-48">
            {restaurant.image ? (
              <Image
                src={restaurant.image}
                alt={restaurant.name}
                layout="fill"
                objectFit="cover"
              />
            ) : (
              <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">No image available</span>
              </div>
            )}
          </div>
          <CardHeader>
            <CardTitle>{restaurant.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-2">{restaurant.address}</p>
            <div className="flex items-center mb-2">
              <span className="text-yellow-500 mr-1">★</span>
              <span className="text-sm">{restaurant.rating.toFixed(1)}</span>
            </div>
            {restaurant.priceLevel !== undefined && (
              <p className="text-sm mb-2">
                Price: {"$".repeat(restaurant.priceLevel)}
              </p>
            )}
            {restaurant.recommendationScore !== undefined && (
              <p className="text-sm font-bold text-green-600">
                Recommendation:{" "}
                {(restaurant.recommendationScore * 100).toFixed(0)}%
              </p>
            )}
            {restaurant.types && restaurant.types.length > 0 && (
              <p className="text-sm text-gray-600">
                Type: {restaurant.types[0]}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default RestaurantList;

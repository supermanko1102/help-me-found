import React from "react";
import Image from "next/image";
import { Restaurant } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RestaurantCardProps {
  restaurant: Restaurant;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
  return (
    <Card className="overflow-hidden">
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
        {restaurant.cuisine && (
          <p className="text-sm text-gray-600">{restaurant.cuisine}</p>
        )}
        <p className="text-sm text-gray-600 mt-1">{restaurant.address}</p>
        <div className="flex justify-between items-center mt-2">
          <span className="flex items-center">
            <span className="text-yellow-500 mr-1">★</span>
            <span className="text-sm">{restaurant.rating.toFixed(1)}</span>
          </span>
          <span className="text-sm">
            價位：{"$".repeat(restaurant.priceLevel)}
          </span>
        </div>
        {restaurant.recommendationScore !== undefined && (
          <p className="text-sm font-bold text-green-600 mt-2">
            推薦指數：{(restaurant.recommendationScore * 100).toFixed(0)}%
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default RestaurantCard;

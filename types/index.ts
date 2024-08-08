export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  address: string;
  rating: number;
  priceLevel: number;
  image: string;
  recommendationScore?: number;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

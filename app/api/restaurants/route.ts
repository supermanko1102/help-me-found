// app/api/restaurants/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getRecommendedRestaurants } from "@/lib/restaurants";
import { Coordinates } from "@/types";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const latitudeStr = searchParams.get("latitude");
  const longitudeStr = searchParams.get("longitude");

  if (!latitudeStr || !longitudeStr) {
    return NextResponse.json(
      { error: "Latitude and longitude are required" },
      { status: 400 }
    );
  }

  const latitude = parseFloat(latitudeStr);
  const longitude = parseFloat(longitudeStr);

  if (isNaN(latitude) || isNaN(longitude)) {
    return NextResponse.json(
      { error: "Invalid latitude or longitude values" },
      { status: 400 }
    );
  }

  const coordinates: Coordinates = { latitude, longitude };

  try {
    const restaurants = await getRecommendedRestaurants(coordinates);
    return NextResponse.json(restaurants);
  } catch (error) {
    console.error("Failed to fetch restaurants:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: "An unexpected error occurred while fetching restaurants" },
      { status: 500 }
    );
  }
}

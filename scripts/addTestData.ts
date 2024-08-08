// scripts/addTestData.ts

import { db } from "../lib/firebase";
import { collection, addDoc, GeoPoint } from "firebase/firestore";

const testRestaurants = [
  {
    name: "美味餐廳",
    cuisine: "中式",
    address: "台北市中山區123號",
    location: new GeoPoint(25.033, 121.5654),
    rating: 4.5,
    priceLevel: 2,
  },
  {
    name: "義大利麵屋",
    cuisine: "義式",
    address: "台北市信義區456號",
    location: new GeoPoint(25.0334, 121.5659),
    rating: 4.2,
    priceLevel: 3,
  },
  // 可以繼續添加更多測試數據...
];

async function addTestData() {
  for (const restaurant of testRestaurants) {
    try {
      const docRef = await addDoc(collection(db, "restaurants"), restaurant);
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }
}

addTestData();

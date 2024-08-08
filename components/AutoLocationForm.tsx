// components/AutoLocationForm.tsx

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

const AutoLocationForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const getLocation = () => {
    setIsLoading(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          router.push(
            `/restaurants?latitude=${latitude}&longitude=${longitude}`
          );
        },
        (error) => {
          console.error("Error getting location:", error);
          toast({
            title: "無法獲取位置",
            description: "請確保您已允許瀏覽器獲取位置信息。",
            variant: "destructive",
          });
          setIsLoading(false);
        }
      );
    } else {
      toast({
        title: "不支持地理位置",
        description: "您的瀏覽器不支持地理位置功能。",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="text-center">
      <Button onClick={getLocation} disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            獲取位置中...
          </>
        ) : (
          "尋找附近的餐廳"
        )}
      </Button>
    </div>
  );
};

export default AutoLocationForm;

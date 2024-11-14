import { createContext, ReactNode, useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { HotelInfo } from "../types/hotel";
import { getHotelInfo } from "../apis/hotelApis";

type HotelContextType = {
  hotelInfo: HotelInfo | null;
  isLoading: boolean;
  updateHotelInfo: (updatedHotel: HotelInfo) => void;
};
const HotelContext = createContext<HotelContextType | undefined>(undefined);

export const HotelProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [hotelInfo, setHotelInfo] = useState<HotelInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchHotel = async () => {
      if (user) {
        try {
          const data = await getHotelInfo();
          setHotelInfo(data);
          setIsLoading(false);
        } catch (error) {
          console.error("Failed to fetch hotel:", error);
        }
      }
    };
    fetchHotel();
  }, [user]);

  const updateHotelInfo = (updatedHotel: HotelInfo) => {
    setHotelInfo(updatedHotel);
  };

  return (
    <HotelContext.Provider value={{ hotelInfo, isLoading, updateHotelInfo }}>
      {children}
    </HotelContext.Provider>
  );
};

export default HotelContext;
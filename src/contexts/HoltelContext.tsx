import { createContext, ReactNode, useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { HotelInfo } from "../types/hotel";

type HotelContextType = {
  hotelInfo: HotelInfo | null
};
const HotelContext = createContext<HotelContextType | undefined>(undefined);

export const HotelProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [hotelInfo, setHotelInfo] = useState<HotelInfo | null>(null);
  useEffect(() => {
    const fetchHotel = async () => {
      if (user) {
        try {
          // TODO Gọi api
          // const data = await api(`/api/hotels/${user.user_id}`);

          setHotelInfo(hotelMock);
        } catch (error) {
          console.error("Failed to fetch hotel:", error);
        }
      }
    };

    fetchHotel();
  }, [user]);

  return (
    <HotelContext.Provider value={{ hotelInfo }}>
      {children}
    </HotelContext.Provider>
  );
};

export default HotelContext;

const hotelMock: HotelInfo = {
  hotelId: "H12345",
  name: "Royal Hotel",
  rating: 5,
  address: "123 Luxury St",
  city: "Hanoi",
  postalCode: "100000",
  country: "Vietnam",
  latitude: 21.0285,
  longitude: 105.8542,
  phoneNumber: "+84123456789",
  email: "info@royalhotel.com",
  websiteUrl: "https://www.royalhotel.com",
  numberOfRooms: 150,
  checkInTime: 14, // giờ, 2 PM
  checkOutTime: 12, // giờ, 12 PM
  description:
    "A luxurious hotel in the heart of Hanoi, offering top-notch services and amenities.",
  logoUrl:"https://img.freepik.com/premium-vector/hotel-icon-logo-vector-design-template_827767-3569.jpg",
  totalStaff: 50,
  ownerName: "Nguyen Van B",
  status: "Open",
};

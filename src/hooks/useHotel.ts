import { useContext } from "react";
import HoltelContext from "../contexts/HoltelContext";

export const useHotel = () => {
    const context = useContext(HoltelContext);
    if (!context) throw new Error("useHotel must be used within HoltelProvider");
    return context;
};

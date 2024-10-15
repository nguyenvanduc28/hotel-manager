import { createContext, ReactNode, useEffect, useState } from "react";
import { User } from "../types/auth";
import { useNavigate } from "react-router-dom";
import { Roles } from "../constants/auth/roleConstants";

type UserWithToken = User & { accessToken: string; refreshToken: string };

interface AuthContextType {
  user: UserWithToken | null;
  loading: boolean; // Thêm trạng thái loading
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserWithToken | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      checkToken(token).then((user) => {
        if (user) {
          setUser(user);
        } else {
          logout();
        }
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (username: string, password: string) => {
    // TODO: Gọi API đăng nhập
    localStorage.setItem("user", JSON.stringify(userMock));
    localStorage.setItem("accessToken", userMock.accessToken);
    localStorage.setItem("refreshToken", userMock.refreshToken);
    setUser(userMock);
  };

  const logout = () => {
    setUser(null);
    localStorage.clear();
    navigate("/login");
  };

  const checkToken = async (token: string): Promise<UserWithToken | null> => {
    try {
      // TODO
      if (token) return userMock;
      return null;
    } catch (e) {
      console.error("Error checking token:", e);
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;


const userMock: UserWithToken = {
  userId: "U12345",
  name: "Nguyen Van A",
  dateOfBirth: 789840000000,
  gender: "Male",
  nationalId: "VN123456789",
  phoneNumber: "+84123456789",
  email: "nguyenvana@example.com",
  address: "123 Nguyen Trai, Hanoi, Vietnam",
  startDate: "2024-01-01",
  status: "Active",
  profilePictureUrl: "https://example.com/profile-pic.jpg",
  emergencyContactName: "Tran Thi B",
  emergencyContactRelationship: "Sister",
  emergencyContactPhone: "+84123456788",
  notes: "Loves coffee and traveling.",
  positionName: "Manager",
  hotelId: "H98765",
  roles: ["ADMIN", "receptionist"],
  accessToken: "mock accessToken",
  refreshToken: "mock refreshToken",
};

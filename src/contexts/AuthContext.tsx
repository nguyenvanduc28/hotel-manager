import { createContext, ReactNode, useEffect, useState } from "react";
import { User } from "../types/auth";
import { useNavigate } from "react-router-dom";
import { login as loginApi, verifyToken } from "../apis/authApis/authApis"; 
import { Roles } from "../constants/admin/constants"; 

type UserWithToken = User & { token: string };

interface AuthContextType {
  user: UserWithToken | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserWithToken | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
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
    setLoading(true);
    try {
      const data = await loginApi( {username, password} );
      
      const { token, user } = data;
      
      const userWithToken = { ...user, token };

      setUser(userWithToken);

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userWithToken));

      navigate("/dashboard");
    } catch (error) {
      console.error("Đăng nhập thất bại:", error);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.clear();
    navigate("/login");
  };

  const checkToken = async (token: string): Promise<UserWithToken | null> => {
    try {
        const data = await verifyToken({ token });
        
        if (data) {
            const userData: UserWithToken = data;
            return userData;
        }
        return null;
    } catch (error) {
        console.error("Error checking token:", error);
        return null;
    }
};


  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

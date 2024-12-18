import { createContext, ReactNode, useEffect, useState } from "react";
import { User } from "../types/auth";
import { useNavigate } from "react-router-dom";
import { login as loginApi, verifyToken } from "../apis/authApis/authApis"; 
import { register as registerApi, registerAdmin as registerAdminApi } from "../apis/authApis/authApis";
import { Employee, Role } from "../types/hotel";
import { getEmployeeInfo } from "../apis/employeeApis";
import { toast } from "react-toastify";

type UserWithToken = User & { token: string };

interface AuthContextType {
  user: UserWithToken | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  register: (username: string, password: string, roles: Role[]) => Promise<void>;
  registerForAdmin: (username: string, password: string, roles: Role[]) => Promise<void>;
  employeeInfo: Employee | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserWithToken | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const [employeeInfo, setEmployeeInfo] = useState<Employee | null>(null);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      checkToken(token).then((user) => {
        if (user) {
          setUser(user);
          fetchEmployeeInfo();
        } else {
          logout();
        }
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const fetchEmployeeInfo = async () => {
    const data = await getEmployeeInfo();
    setEmployeeInfo(data);
  }

  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      const data = await loginApi( {username, password} );
      
      const { token, user } = data;
      
      const userWithToken = { ...user, token };

      setUser(userWithToken);

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userWithToken));
      fetchEmployeeInfo();
      
      if (user.roles.some((role: Role) => role.name === "RECEPTIONIST")) {
        navigate("/reception/booking/list");
      } else if (user.roles.some((role: Role) => role.name === "RESTAURANT_COUNTER")) {
        navigate("/service-counter");
      } else if (user.roles.some((role: Role) => role.name === "BAR_COUNTER")) {
        navigate("/service-counter");
      } else if (user.roles.some((role: Role) => role.name === "SERVICE_COUNTER")) {
        navigate("/service-counter");
      } else {
        navigate("/admin");
      }
    } catch (error) {
      toast.error("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setEmployeeInfo(null);
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

const register = async (username: string, password: string, roles: Role[]) => {
  setLoading(true);
  try {
    const data = await registerApi({ username, password, roles });
    
    const { token, user } = data;
    const userWithToken = { ...user, token };

    setUser(userWithToken);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userWithToken));

    navigate("/admin/hotel-setting");
  } catch (error) {
    console.error("Đăng ký thất bại:", error);
    throw error;
  } finally {
    setLoading(false);
  }
};
const registerForAdmin = async (username: string, password: string, roles: Role[]) => {
  setLoading(true);
  try {
    const data = await registerAdminApi({ username, password, roles });
    
    const { token, user } = data;
    const userWithToken = { ...user, token };

    setUser(userWithToken);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userWithToken));

    navigate("/admin/hotel-setting");
  } catch (error) {
    console.error("Đăng ký thất bại:", error);
    throw error;
  } finally {
    setLoading(false);
  }
};
  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, registerForAdmin, employeeInfo }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

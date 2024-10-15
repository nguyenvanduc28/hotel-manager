import { ReactNode } from "react";
import { Outlet } from "react-router-dom";


const AuthLayout: React.FC = () => {
  return (
    <div>
      <h1>AuthLayout</h1>
      <Outlet/>
    </div>
  );
};

export default AuthLayout;

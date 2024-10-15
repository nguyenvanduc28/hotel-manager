import { ReactNode } from "react";
import { Outlet } from "react-router-dom";

const ReceptionLayout: React.FC = () => {
  return (
    <div>
      <h1>ReceptionLayout</h1>
      <Outlet />
    </div>
  );
};

export default ReceptionLayout;

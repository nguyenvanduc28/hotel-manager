import { Outlet } from "react-router-dom";

const ServiceLayout: React.FC = () => {
  return (
    <div>
      <h1>ServiceLayout</h1>
      <Outlet />
    </div>
  );
};

export default ServiceLayout;

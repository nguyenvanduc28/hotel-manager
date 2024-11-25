import { Outlet, Route, Routes, useNavigate } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout/AdminLayout";
import { useAuth } from "../hooks/useAuth";
import NoPermission from "../pages/NoPermission";
import AdminRouters, { PublicRoutes, ReceptionRoutes, ServiceCounterRoutes } from "./routes";
import LoginPage from "../pages/AuthPage/LoginPage";
import { useEffect } from "react";
import NotFound from "../pages/NotFound";
import ReceptionLayout from "../layouts/ReceptionLayout/ReceptionLayout";
import RegisterPage from "../pages/AuthPage/RegisterPage";
import ServiceCounterLayout from "../pages/ServiceCounter/ServiceCounterLayout";

interface ProtectedRouteProps {
  roles: string[];
  linkToNoPermission?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ roles, linkToNoPermission = "/no-permission" }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/login");
      } else if (!user.roles.some((role) => roles.includes(role.name))) {
        navigate(linkToNoPermission);
      }
    }
  }, [loading, user, navigate, roles]);

  if (loading) return null;

  return <Outlet />;
};

const AppRouters: React.FC = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoute roles={["ADMIN", "RECEPTIONIST", "EMPLOYEE", "MANAGER", "SUPER_ADMIN", "DIRECTOR", "ACCOUNTANT", "SUPER_ADMIN", "WAREHOUSE_MANAGER"]} />}>
        <Route path="/admin" element={<AdminLayout />}>
          {AdminRouters.map((route) => (
            <Route
              key={route.path}
              element={<ProtectedRoute roles={route.allowedRoles} linkToNoPermission={"/admin/no-permission"} />}
            >
              <Route path={route.path} element={route.element} />
            </Route>
          ))}
        </Route>
        <Route path="/reception" element={<ReceptionLayout />}>
          {ReceptionRoutes.map((route) => (
            <Route
              key={route.path}
              element={<ProtectedRoute roles={route.allowedRoles} linkToNoPermission={"/reception/no-permission"} />}
            >
              <Route path={route.path} element={route.element} />
            </Route>
          ))}
        </Route>
        {ServiceCounterRoutes.map((route) => (
          <Route
            key={route.path}
            element={<ProtectedRoute roles={route.allowedRoles} linkToNoPermission={"/service-counter/no-permission"} />}
          >
            <Route path={route.path} element={route.element} />
          </Route>
        ))}
        <Route path="/no-permission" element={<NoPermission />} />
      </Route>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register-admin" element={<RegisterPage />} />
      {PublicRoutes.map((route) => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouters;

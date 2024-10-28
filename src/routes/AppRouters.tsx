import { Outlet, Route, Routes, useNavigate } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout/AdminLayout";
import { useAuth } from "../hooks/useAuth";
import NoPermission from "../pages/NoPermission";
import AdminRouters from "./routes";
import LoginPage from "../pages/AuthPage/LoginPage";
import { useEffect } from "react";
import NotFound from "../pages/NotFound";

interface ProtectedRouteProps {
  roles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ roles }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (!loading) {
  //     if (!user) {
  //       navigate("/login");
  //     } else if (!user.roles.some((role) => roles.includes(role.name))) {
  //       navigate("/no-permission");
  //     }
  //   }
  // }, [loading, user, navigate, roles]);

  if (loading) return null;

  return <Outlet />;
};

const AppRouters: React.FC = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoute roles={["ADMIN"]} />}>
        <Route path="/admin" element={<AdminLayout />}>
          {AdminRouters.map((route) => (
            <Route
              key={route.path}
              element={<ProtectedRoute roles={route.allowedRoles} />}
            >
              <Route path={route.path} element={route.element} />
            </Route>
          ))}
        </Route>
        <Route path="/no-permission" element={<NoPermission />} />
      </Route>
      <Route path="/login" element={<LoginPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouters;

import Test from "../Test";
export type RouteWrapperProps = {
  path: string;
  element: JSX.Element;
  allowedRoles: string[];
};


const TEST: RouteWrapperProps = {
  path: "test",
  element: <Test />,
  allowedRoles: ["ADMIN"],
};

export const AdminRouters: RouteWrapperProps[] = [TEST];

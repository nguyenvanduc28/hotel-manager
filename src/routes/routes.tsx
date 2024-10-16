import Dashboard from "../pages/AdminPage/Dashboard/Dashboard";
import Rooms from "../pages/AdminPage/Rooms/Rooms";
import RoomArrangement from "../pages/AdminPage/RoomArrangement/RoomArrangement";
import RoomAmenities from "../pages/AdminPage/RoomAmenities/RoomAmenities";
import Bookings from "../pages/AdminPage/Bookings/Bookings";
import Employees from "../pages/AdminPage/Employees/Employees";
import Customers from "../pages/AdminPage/Customers/Customers";
import Services from "../pages/AdminPage/Services/Services";
import Inventory from "../pages/AdminPage/Inventory/Inventory";
import InventoryHistory from "../pages/AdminPage/InventoryHistory/InventoryHistory";
import ReportSummary from "../pages/AdminPage/Reports/Summary/ReportSummary";
import ReportServiceRevenue from "../pages/AdminPage/Reports/ServiceRevenue/ReportServiceRevenue";
import ReportBillRevenue from "../pages/AdminPage/Reports/BillRevenue/ReportBillRevenue";
import Invoices from "../pages/AdminPage/Invoices/Invoices";
import HotelSetting from "../pages/AdminPage/HotelSetting/HotelSetting";
import { Roles } from "../constants/auth/roleConstants";
import EmployeeRole from "../pages/AdminPage/Employees/EmployeeRole";
import ServiceUsage from "../pages/AdminPage/Services/ServiceUsage";

export type RouteWrapperProps = {
  path: string;
  element: JSX.Element;
  allowedRoles: string[];
};

const AdminRoutes: RouteWrapperProps[] = [
  {
    path: "dashboard",
    element: <Dashboard />,
    allowedRoles: [Roles.ADMIN, Roles.RECEPTIONIST], // Các vai trò có quyền truy cập
  },
  {
    path: "rooms",
    element: <Rooms />,
    allowedRoles: [Roles.ADMIN, Roles.STAFF_MANAGER],
  },
  {
    path: "room-arrangement",
    element: <RoomArrangement />,
    allowedRoles: [Roles.ADMIN, Roles.STAFF_MANAGER],
  },
  {
    path: "room-amenities",
    element: <RoomAmenities />,
    allowedRoles: [Roles.ADMIN, Roles.STAFF_MANAGER],
  },
  {
    path: "bookings",
    element: <Bookings />,
    allowedRoles: [Roles.ADMIN, Roles.RECEPTIONIST],
  },
  {
    path: "employees",
    element: <Employees />,
    allowedRoles: [Roles.ADMIN, Roles.STAFF_MANAGER],
  },
  {
    path: "roles",
    element: <EmployeeRole />,
    allowedRoles: [Roles.ADMIN, Roles.STAFF_MANAGER],
  },
  {
    path: "customers",
    element: <Customers />,
    allowedRoles: [Roles.ADMIN, Roles.CUSTOMER_MANAGER],
  },
  {
    path: "services",
    element: <Services />,
    allowedRoles: [Roles.ADMIN, Roles.SERVICE_MANAGER],
  },
  {
    path: "service-usage",
    element: <ServiceUsage />,
    allowedRoles: [Roles.ADMIN, Roles.SERVICE_MANAGER],
  },
  {
    path: "inventory",
    element: <Inventory />,
    allowedRoles: [Roles.ADMIN, Roles.WAREHOUSE_MANAGER],
  },
  {
    path: "inventory-history",
    element: <InventoryHistory />,
    allowedRoles: [Roles.ADMIN, Roles.WAREHOUSE_MANAGER],
  },
  {
    path: "report-summary",
    element: <ReportSummary />,
    allowedRoles: [Roles.ADMIN, Roles.REPORT_MANAGER],
  },
  {
    path: "report-service-revenue",
    element: <ReportServiceRevenue />,
    allowedRoles: [Roles.ADMIN, Roles.REPORT_MANAGER],
  },
  {
    path: "report-bill-revenue",
    element: <ReportBillRevenue />,
    allowedRoles: [Roles.ADMIN, Roles.REPORT_MANAGER],
  },
  {
    path: "invoices",
    element: <Invoices />,
    allowedRoles: [Roles.ADMIN, Roles.INVOICE_MANAGER],
  },
  {
    path: "hotel-setting",
    element: <HotelSetting />,
    allowedRoles: [Roles.ADMIN, Roles.HOTEL_INFO_MANAGER],
  },
];

export default AdminRoutes;

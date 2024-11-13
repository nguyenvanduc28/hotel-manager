import Dashboard from "../pages/AdminPage/Dashboard/Dashboard";
import RoomList from "../pages/AdminPage/RoomList/RoomList";
import RoomType from "../pages/AdminPage/RoomType/RoomType";
import RoomAmenities from "../pages/AdminPage/RoomAmenities/RoomAmenities";
import Employees from "../pages/AdminPage/Employees/Employees";
import Customers from "../pages/AdminPage/Customers/Customers";
import Services from "../pages/AdminPage/Services/Services";
import Inventory from "../pages/AdminPage/Inventory/Inventory";
import InventoryHistory from "../pages/AdminPage/InventoryHistory/InventoryHistory";
import ReportSummary from "../pages/AdminPage/Reports/Summary/ReportSummary";
import ReportServiceRevenue from "../pages/AdminPage/Reports/ServiceRevenue/ReportServiceRevenue";
import ReportBillRevenue from "../pages/AdminPage/Reports/BillRevenue/ReportBillRevenue";
import HotelSetting from "../pages/AdminPage/HotelSetting/HotelSetting";
import { ROLES } from "../constants/auth/roleConstants";
import EmployeeRole from "../pages/AdminPage/Employees/EmployeeRole";
import ServiceUsage from "../pages/AdminPage/Services/ServiceUsage";
import { ADMIN_PATHS, RECEPTION_PATHS } from "../constants/admin/adminPath";
import RoomAmenityCreate from "../pages/AdminPage/RoomAmenities/RoomAmenityCreate";
import RoomTypeCreate from "../pages/AdminPage/RoomType/RoomTypeCreate";
import RoomListCreate from "../pages/AdminPage/RoomList/RoomListCreate";
import CustomerCreate from "../pages/AdminPage/Customers/CustomerCreate";
import BookingCreate from "../pages/ReceptionPage/Booking/BookingCreate";
import BookingList from "../pages/ReceptionPage/Booking/BookingList";
import RoomListRecep from "../pages/ReceptionPage/Room/RoomListRecep";
import RoomAmenityEdit from "../pages/AdminPage/RoomAmenities/RoomAmenityEdit";
import RoomEdit from "../pages/AdminPage/RoomList/RoomEdit";
import RoomAmenityCategories from "../pages/AdminPage/RoomAmenities/RoomAmenityCategories";
import Checkout from "../pages/ReceptionPage/Checkout/Checkout";
import Payment from "../pages/ReceptionPage/Payment/Payment";
import InvoiceList from "../pages/ReceptionPage/Invoice/InvoiceList";
import NoPermission from "../pages/NoPermission";
import CustomerDetail from "../pages/AdminPage/Customers/CustomerDetail";

export type RouteWrapperProps = {
  path: string;
  element: JSX.Element;
  allowedRoles: string[];
  children?:RouteWrapperProps[];
};

const AdminRoutes: RouteWrapperProps[] = [
  {
    path: ADMIN_PATHS.DASHBOARD,
    element: <Dashboard />,
    allowedRoles: [ROLES.ADMIN, ROLES.RECEPTIONIST],
  },
  {
    path: ADMIN_PATHS.ROOM_LIST,
    element: <RoomList />,
    allowedRoles: [ROLES.ADMIN, ROLES.STAFF_MANAGER],
  },
  {
    path: ADMIN_PATHS.ROOM_CREATE,
    element: <RoomListCreate />,
    allowedRoles: [ROLES.ADMIN, ROLES.STAFF_MANAGER],
  },
  {
    path: ADMIN_PATHS.ROOM_EDIT,
    element: <RoomEdit />,
    allowedRoles: [ROLES.ADMIN, ROLES.STAFF_MANAGER],
  },
  {
    path: ADMIN_PATHS.ROOM_TYPE,
    element: <RoomType />,
    allowedRoles: [ROLES.ADMIN, ROLES.STAFF_MANAGER],
  },
  {
    path: ADMIN_PATHS.ROOM_TYPE_CREATE,
    element: <RoomTypeCreate />,
    allowedRoles: [ROLES.ADMIN, ROLES.STAFF_MANAGER],
  },
  {
    path: ADMIN_PATHS.ROOM_AMENITIES,
    element: <RoomAmenities />,
    allowedRoles: [ROLES.ADMIN, ROLES.STAFF_MANAGER],
  },
  {
    path: ADMIN_PATHS.ROOM_AMENITY_CATEGORY,
    element: <RoomAmenityCategories />,
    allowedRoles: [ROLES.ADMIN, ROLES.STAFF_MANAGER],
  },
  {
    path: ADMIN_PATHS.ROOM_AMENITY_CREATE,
    element: <RoomAmenityCreate />,
    allowedRoles: [ROLES.ADMIN, ROLES.STAFF_MANAGER],
  },
  {
    path: ADMIN_PATHS.ROOM_AMENITY_EDIT,
    element: <RoomAmenityEdit />,
    allowedRoles: [ROLES.ADMIN, ROLES.STAFF_MANAGER],
  },
  {
    path: ADMIN_PATHS.BOOKINGS,
    element: <BookingList />,
    allowedRoles: [ROLES.ADMIN, ROLES.RECEPTIONIST],
  },
  {
    path: ADMIN_PATHS.EMPLOYEES,
    element: <Employees />,
    allowedRoles: [ROLES.ADMIN, ROLES.STAFF_MANAGER],
  },
  {
    path: ADMIN_PATHS.ROLES,
    element: <EmployeeRole />,
    allowedRoles: [ROLES.ADMIN, ROLES.STAFF_MANAGER],
  },
  {
    path: ADMIN_PATHS.CUSTOMERS,
    element: <Customers />,
    allowedRoles: [ROLES.ADMIN, ROLES.CUSTOMER_MANAGER, ROLES.RECEPTIONIST],
  },
  {
    path: ADMIN_PATHS.CUSTOMER_CREATE,
    element: <CustomerCreate />,
    allowedRoles: [ROLES.ADMIN, ROLES.CUSTOMER_MANAGER, ROLES.RECEPTIONIST],
  },
  {
    path: ADMIN_PATHS.SERVICES,
    element: <Services />,
    allowedRoles: [ROLES.ADMIN, ROLES.SERVICE_MANAGER],
  },
  {
    path: ADMIN_PATHS.SERVICE_USAGE,
    element: <ServiceUsage />,
    allowedRoles: [ROLES.ADMIN, ROLES.SERVICE_MANAGER],
  },
  {
    path: ADMIN_PATHS.INVENTORY,
    element: <Inventory />,
    allowedRoles: [ROLES.ADMIN, ROLES.WAREHOUSE_MANAGER],
  },
  {
    path: ADMIN_PATHS.INVENTORY_HISTORY,
    element: <InventoryHistory />,
    allowedRoles: [ROLES.ADMIN, ROLES.WAREHOUSE_MANAGER],
  },
  {
    path: ADMIN_PATHS.REPORT_SUMMARY,
    element: <ReportSummary />,
    allowedRoles: [ROLES.ADMIN, ROLES.REPORT_MANAGER],
  },
  {
    path: ADMIN_PATHS.REPORT_SERVICE_REVENUE,
    element: <ReportServiceRevenue />,
    allowedRoles: [ROLES.ADMIN, ROLES.REPORT_MANAGER],
  },
  {
    path: ADMIN_PATHS.REPORT_BILL_REVENUE,
    element: <ReportBillRevenue />,
    allowedRoles: [ROLES.ADMIN, ROLES.REPORT_MANAGER],
  },
  {
    path: ADMIN_PATHS.INVOICES,
    element: <InvoiceList />,
    allowedRoles: [ROLES.ADMIN, ROLES.INVOICE_MANAGER, ROLES.RECEPTIONIST],
  },
  {
    path: ADMIN_PATHS.HOTEL_SETTING,
    element: <HotelSetting />,
    allowedRoles: [ROLES.ADMIN, ROLES.HOTEL_INFO_MANAGER],
  },
  {
    path: ADMIN_PATHS.NO_PERMISSION,
    element: <NoPermission />,
    allowedRoles: [],
  },
  {
    path: ADMIN_PATHS.CUSTOMER_DETAIL,
    element: <CustomerDetail />,
    allowedRoles: [ROLES.ADMIN, ROLES.RECEPTIONIST],
  },
];
export const ReceptionRoutes: RouteWrapperProps[] = [
  {
    path: RECEPTION_PATHS.BOOKING_CREATE,
    element: <BookingCreate />,
    allowedRoles: [ROLES.ADMIN, ROLES.RECEPTIONIST],
  },
  {
    path: RECEPTION_PATHS.BOOKING_LIST,
    element: <BookingList />,
    allowedRoles: [ROLES.ADMIN, ROLES.RECEPTIONIST],
  },
  {
    path: RECEPTION_PATHS.ROOM_LIST,
    element: <RoomListRecep />,
    allowedRoles: [ROLES.ADMIN, ROLES.RECEPTIONIST],
  },
  {
    path: RECEPTION_PATHS.CHECKOUT,
    element: <Checkout />,
    allowedRoles: [ROLES.ADMIN, ROLES.RECEPTIONIST],
  },
  {
    path: RECEPTION_PATHS.PAYMENT,
    element: <Payment />,
    allowedRoles: [ROLES.ADMIN, ROLES.RECEPTIONIST],
  },
  {
    path: RECEPTION_PATHS.INVOICE_LIST,
    element: <InvoiceList />,
    allowedRoles: [ROLES.ADMIN, ROLES.RECEPTIONIST],
  },
  {
    path: RECEPTION_PATHS.CUSTOMER_LIST,
    element: <Customers />,
    allowedRoles: [ROLES.ADMIN, ROLES.RECEPTIONIST],
  },
  {
    path: RECEPTION_PATHS.NO_PERMISSION,
    element: <NoPermission />,
    allowedRoles: [],
  },
  {
    path: RECEPTION_PATHS.CUSTOMER_DETAIL,
    element: <CustomerDetail />,
    allowedRoles: [ROLES.ADMIN, ROLES.RECEPTIONIST],
  },
]
export default AdminRoutes;

export const ADMIN_PATHS = {
  DASHBOARD: "dashboard",
  ROOM_LIST: "room-list",
  ROOM_EDIT: "room-list/:id",
  ROOM_CREATE: "room-list/create",
  ROOM_TYPE: "room-type",
  ROOM_TYPE_CREATE: "room-type/create",
  ROOM_AMENITIES: "room-amenities",
  ROOM_AMENITY_CATEGORY: "room-amenities/categories",
  ROOM_AMENITY_CREATE: "room-amenities/create",
  ROOM_AMENITY_EDIT: "room-amenities/:type/:id",
  BOOKINGS: "bookings",
  BOOKING_CREATE: "bookings/create",
  EMPLOYEES: "employees",
  ROLES: "roles",
  CUSTOMERS: "customers",
  CUSTOMER_CREATE:"customers/create",
  CUSTOMER_DETAIL: "customers/:id",
  SERVICES: "services",
  SERVICE_USAGE: "service-usage",
  INVENTORY: "inventory",
  INVENTORY_HISTORY: "inventory-history",
  REPORT_SUMMARY: "report-summary",
  REPORT_SERVICE_REVENUE: "report-service-revenue",
  REPORT_BILL_REVENUE: "report-bill-revenue",
  INVOICES: "invoices",
  HOTEL_SETTING: "hotel-setting",
  NO_PERMISSION: "no-permission",
};

export const RECEPTION_PATHS = {
  BOOKING_CREATE:"booking/create",
  BOOKING_LIST:"booking/list",
  ROOM_LIST:"room/list",
  CHECKOUT:"checkout/:id",
  PAYMENT:"checkout/:id/payment",
  INVOICE_LIST:"invoice/list",
  CUSTOMER_LIST:"customer/list",
  CUSTOMER_DETAIL: "customer/:id",
  NO_PERMISSION: "no-permission",
}

export const PUBLIC_PATHS = {
  PUBLIC_PAGE: "/",
}
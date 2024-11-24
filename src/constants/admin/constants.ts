import { ROLES } from "../auth/roleConstants";

export const AMENITY_CATEGORY = {
    CONSUMABLE_AMENITIES: 'Tiện nghi tiêu hao',
    NON_CONSUMABLE_AMENITIES: 'Tiện nghi không tiêu hao'
}

export const ROOM_STATUS = {
    AVAILABLE: "Còn trống",
    OCCUPIED: "Đang có khách",
    OUT_OF_SERVICE: "Ngừng phục vụ",
    CLEANING: "Đang dọn dẹp",
    RESERVED: "Đã đặt trước",
} as const;

export const AMENITY_STATUS = {
    AVAILABLE: "Sẵn sàng",
    OUT_OF_SERVICE: "Ngừng phục vụ",
    MAINTENANCE: "Bảo trì",
} as const;


export const GENDERS = {
    MALE: "Nam",
    FEMALE: "Nữ",
    OTHER: "Khác",
} as const;

export const EMPLOYEE_STATUS = {
    ACTIVE: "Đang làm việc",
    INACTIVE: "Đã nghỉ việc",
    ON_LEAVE: "Đang nghỉ phép",
    PROBATION: "Đang thử việc",
} as const;

export type RoomStatus = typeof ROOM_STATUS[keyof typeof ROOM_STATUS];
export type Roles = typeof ROLES[keyof typeof ROLES];

export const EQUIPMENT_STATUS = {
    AVAILABLE: 'AVAILABLE',          // Thiết bị hoạt động bình thường
    OUT_OF_SERVICE: 'OUT_OF_SERVICE', // Thiết bị hỏng, cần sửa chữa
    MAINTENANCE: 'MAINTENANCE',        // Thiết bị đã được thay thế
} as const;

export type EquipmentStatus = typeof EQUIPMENT_STATUS[keyof typeof EQUIPMENT_STATUS];


export enum BOOKING_STATUS {
    Pending = "Đang chờ",
    Confirmed = "Đã xác nhận",
    CheckedIn = "Đã nhận phòng",
    CheckedOut = "Đã trả phòng",
    Canceled = "Đã hủy",
    NoShow = "Không đến",
    AwaitingPayment = "Đang chờ thanh toán",
    Refunded = "Đã hoàn tiền",
    Completed = "Đã hoàn tất",
}
export type BookingStatus = typeof BOOKING_STATUS[keyof typeof BOOKING_STATUS];

export enum BOOKING_SERVICE_ORDER_STATUS {
    NEW = "Mới",
    SERVICED = "Đã phục vụ",
}
export type BookingServiceOrderStatus = typeof BOOKING_SERVICE_ORDER_STATUS[keyof typeof BOOKING_SERVICE_ORDER_STATUS];

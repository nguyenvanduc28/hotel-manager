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
    WORKING: 'Đang hoạt động',          // Thiết bị hoạt động bình thường
    OUT_OF_ORDER: 'Cần sửa chữa', // Thiết bị hỏng, cần sửa chữa
    REPLACED: 'Đang hỏng',        // Thiết bị đã được thay thế
  } as const;
  
  export type EquipmentStatus = typeof EQUIPMENT_STATUS[keyof typeof EQUIPMENT_STATUS];
  
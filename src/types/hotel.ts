import {  BOOKING_SERVICE_ORDER_STATUS, BookingStatus, EMPLOYEE_STATUS, EquipmentStatus, GENDERS, Roles, RoomStatus } from "../constants/admin/constants";

export type HotelInfo = {
    id: number;
    name: string;
    rating?: number;
    address?: string;
    city?: string;
    postalCode?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
    phoneNumber?: string;
    email?: string;
    websiteUrl?: string;
    numberOfRooms?: number;
    checkInTime?: string;
    checkOutTime?: string;
    description?: string;
    logoUrl?: string;
    totalStaff?: number;
    ownerName?: string;
    status?: string;
    images?: Image[];

    // Tiện ích cơ bản
    hasWifi?: boolean;        // Có Wifi
    hasParking?: boolean;     // Có bãi đậu xe
    hasRestaurant?: boolean;  // Có nhà hàng
    hasSwimmingPool?: boolean; // Có hồ bơi
    hasConferenceRoom?: boolean; // Có phòng hội nghị
    has24HourFrontDesk?: boolean; // Có lễ tân 24 giờ
    hasBar?: boolean;         // Có quầy bar
    hasElevator?: boolean;    // Có thang máy
    hasAirConditioning?: boolean; // Có điều hòa
    hasShuttle?: boolean;     // Có chuyến xe đưa đón
    
    otherAmenities?: string;  // Tiện ích khác
};

export type Image = {
    id: number;
    url: string;
    type?: string;
    size?: number;
    roomId?: number;
    hotelId?: number;
    publicId?: string;
    fileName?: string;
    description?: string;
}

export type WarehouseForm = {
    id?: number;
    itemId?: string;
    name?: string;
    quantity?: number;
    importPrice?: number;
}

export type RoomPrice = {
    id?: number;
    roomTypeId?: number;
    date?: number;
    price?: number;
}

export type RoomType = {
    id?: number;
    name?: string;
    description?: string;
    singleBedCount?: number;
    doubleBedCount?: number;
    extraBedAvailable?: boolean;
    sizeRange?: string;
    maxOccupancy?: number;
    basePricePerNight?: number;
    roomPrices?: RoomPrice[];
    priceToday?: number;
}

export type RoomItem = {
    id?: number;
    roomNumber?: number;
    floor?: number;
    isAvailable?: boolean;
    
    description?: string;
    lastCleaned?: number;
    isSmokingAllowed?: boolean;
    hasPrivateKitchen?: boolean;
    hasPrivateBathroom?: boolean;
    hasBalcony?: boolean;
    hasLakeView?: boolean;
    hasGardenView?: boolean;
    hasPoolView?: boolean;
    hasMountainView?: boolean;
    hasLandmarkView?: boolean;
    hasCityView?: boolean;
    hasRiverView?: boolean;
    hasCourtyardView?: boolean;
    hasFreeWifi?: boolean;
    hasSoundproofing?: boolean;
    size?:number;
    images?:string;
    imageList?: Image[];
};

export type ConsumableCategories = {
    id?: number;
    name?:string;
    description?:string;
}

export type Consumables = {
    id?:number;
    name?:string;
    consumableCategory?:ConsumableCategories;
    roomId?:number;
    price?:number;
    quantity?:number;
    unit?:string;
    barcode?:string;
    expiryDate?:number;
    description?:string;
}
export type EquipmentCategory ={
    id?: number;
    name?:string;
    description?:string;
}

export type Equipments = {
    id?:number;
    name?:string;
    equipmentCategory?:EquipmentCategory;
    roomId?:number;
    barcode?:string;
    installationDate?:number;
    status?:EquipmentStatus;
    description?:string;
}

export type RoomInfo = RoomItem & {
    roomType?: RoomType;
    consumables?:Consumables[];
    equipmentList?:Equipments[];
}

export type Role = {
    id: number;
    name: Roles;
}
export type Genders = typeof GENDERS[keyof typeof GENDERS];
export type EmployeeStatus = typeof EMPLOYEE_STATUS[keyof typeof EMPLOYEE_STATUS];
export type Employee = {
    id?: string;
    name?: string;
    birthDay?: number;
    gender?: Genders;
    nationality?: string;
    phoneNumber?: string;
    identityNumber?: string;
    email?: string;
    address?: string;
    startDate?: number;
    status?: EmployeeStatus;
    profilePictureUrl?: string;
    emergencyContactName?: string;
    emergencyContactRelationship?: string;
    emergencyContactPhone?: string;
    notes?: string;
    positionName?: string;
    user?: AuthUser;
};

export type Customer = {
    id: number;
    name?: string;
    email?: string;
    nationality?: string;
    phoneNumber?: string;
    address?: string;
    dateOfBirth?: number;
    gender?: Genders;
    notes?: string;
    identityNumber?: string;
}

export type BookingConsumable = {
    id?: number;
    name?: string;
    consumableCategory?: ConsumableCategories;
    unit?: string;
    expiryDate?: number;
    barcode?: string;
    description?: string;
    quantityUsed?: number;
    totalPrice?: number;
    consumableId?: number;
}

export type BookingEquipmentDamaged = {
    id?: number;
    name?: string;
    equipmentCategory?: EquipmentCategory;
    installationDate?: number;
    barcode?: string;
    description?: string;
    damageFee?: number;
    damageDescription?: string;
    equipmentId?: number;
}

export type Booking = {
    id:number;
    customer: Customer; 
    checkInDate?: number; // Ngày nhận phòng
    checkOutDate?: number; // Ngày trả phòng
    bookingDate?: number; // ngày đặt
    estimatedArrivalTime?: number; // Thời gian đến dự kiến
    checkInTime?: number; // Thời gian check-in
    checkOutTime?: number; // Thời gian check-out
    confirmedTime?: number; // Thời gian xác nhận
    isGroup?: boolean; 
    totalCost?: number; 
    status: BookingStatus; 
    deposit?: number; 
    cancellationPolicy?: string; 
    canceledAt?: number; 
    isGuaranteed?: boolean;
    numberOfAdults?: number;
    numberOfChildren?: number;
    rooms: RoomInfo[];
    consumablesUsed?: BookingConsumable[];
    equipmentDamagedList?: BookingEquipmentDamaged[];
    servicesUsed?: BookingService;
};

export type Invoice = {
    id?: number;
    totalAmount?: number;
    paymentMethod?: string;
    booking?: Booking;
    customer?: Customer;
    issueDate?: number;
    paymentStatus?: string;
}

export interface HotelSearchResult {
    id: number;
    name: string;
    address: string;
    description: string;
    rating: number;
    images: Image[];
    availableRoomCount: number;
    lowestPrice: number;
    hasWifi: boolean;
    hasParking: boolean;
    hasRestaurant: boolean;
    hasSwimmingPool: boolean;
    hasConferenceRoom: boolean;
    has24HourFrontDesk: boolean;
    hasBar: boolean;
    hasElevator: boolean;
    hasAirConditioning: boolean;
    hasShuttle: boolean;
    otherAmenities: string;
    longitude: number;
    latitude: number;
    logoUrl: string;
}


export interface AuthUser {
    username: string;
    password: string;
    roles: Role[];
  }

export interface ServiceType {
    id: number;
    name: string;
    description?: string;
    serviceType?: string;
}

export interface ServiceItem {
    id: number;
    serviceType: ServiceType;
    name: string;
    price: number;
    description?: string;
    image?: string;
}

export interface BookingService {
    id?: number;
    bookingId: number;
    totalPrice?: number;
    serviceOrders: BookingServiceOrder[];
}

export interface BookingServiceOrder {
    id?: number;
    bookingServiceId: number;
    serviceTypeId?: number;
    orderItems: OrderItem[];
    totalPrice?: number;
    orderCreatedAt?: number;
    servicedAt?: number;
    status?: BOOKING_SERVICE_ORDER_STATUS;
    note?: string;
}

export interface OrderItem {
    id?: number;
    serviceItem: ServiceItem;
    quantity: number;
    totalPrice: number;
}

export interface GeneralReport {
    totalRevenue: number; // Tổng doanh thu
    totalBookings: number; // Tổng số lượt đặt phòng
    totalCustomers: number; // Tổng số khách hàng
    averageRevenuePerBooking: number; // Doanh thu trung bình trên mỗi đơn đặt phòng
    totalCompletedBookings: number; // Tổng số đơn đặt phòng đã hoàn thành
    totalCanceledBookings: number; // Tổng số đơn đặt phòng đã hủy
    serviceRevenue: number; // Doanh thu từ dịch vụ
    roomRevenue: number; // Doanh thu từ phòng
    consumableRevenue: number; // Doanh thu từ tiêu dùng nội bộ
}

export interface PopularServiceItem {
    serviceItem: ServiceItem;
    usageCount: number; // Số lần sử dụng
}

export interface ServiceReport {
    serviceTypeId: number;
    serviceTypeName: string;
    totalRevenue: number; // Tổng doanh thu
    usageCount: number; // Số lần sử dụng
    timePeriodStart: number; // Thời gian bắt đầu (dạng timestamp)
    timePeriodEnd: number; // Thời gian kết thúc (dạng timestamp)
    popularServiceItems: PopularServiceItem[];
}

export interface RoomTypeReport {
    roomTypeId: number; // ID loại phòng
    roomTypeName: string; // Tên loại phòng
    totalRevenue: number; // Tổng doanh thu từ loại phòng
    totalBookings: number; // Tổng số lượt đặt phòng từ loại phòng
    timePeriodStart: number; // Thời gian bắt đầu (dạng timestamp)
    timePeriodEnd: number; // Thời gian kết thúc (dạng timestamp)
  }
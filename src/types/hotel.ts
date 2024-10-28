import {  BookingStatus, EMPLOYEE_STATUS, EquipmentStatus, GENDERS, Roles, RoomStatus } from "../constants/admin/constants";

export type HotelInfo = {
    hotelId: string;
    name: string;
    rating: number;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    latitude: number;
    longitude: number;
    phoneNumber: string;
    email: string;
    websiteUrl?: string;
    numberOfRooms: number;
    checkInTime: number;
    checkOutTime: number;
    description: string;
    logoUrl: string;
    totalStaff: number;
    ownerName: string;
    status: string;
};


export type WarehouseForm = {
    id?: number;
    itemId?: string;
    name?: string;
    quantity?: number;
    importPrice?: number;
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
}

export type RoomItem = {
    id?: number;
    roomNumber?: number;
    floor?: number;
    isAvailable?: boolean;
    
    description?: string;
    lastCleaned?: number;
    isSmokingAllowed?: boolean;
    has_private_kitchen?:boolean;
    has_private_bathroom?:boolean;
    has_balcony?:boolean;
    has_lake_view?:boolean;
    has_garden_view?:boolean;
    has_pool_view?:boolean;
    has_mountain_view?:boolean;
    has_landmark_view?:boolean;
    has_city_view?:boolean;
    has_river_view?:boolean;
    has_courtyard_view?:boolean;
    has_free_wifi?:boolean;
    has_soundproofing?:boolean;
    size?:number;
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
    dateOfBirth?: number;
    gender?: Genders;
    nationalId?: string;
    phoneNumber?: string;
    email?: string;
    address?: string;
    startDate?: string;
    status?: EmployeeStatus;
    profilePictureUrl?: string;
    emergencyContactName?: string;
    emergencyContactRelationship?: string;
    emergencyContactPhone?: string;
    notes?: string;
    positionName?: string;
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

export type Booking = {
    id:number;
    customer: Customer; 
    checkInDate?: number; // Ngày nhận phòng
    checkOutDate?: number; // Ngày trả phòng
    bookingDate?: number; // ngày đặt
    estimatedArrivalTime?: number; // Thời gian đến dự kiến
    checkInTime?: number; // Thời gian check-in
    checkOutTime?: number; // Thời gian check-out
    isGroup?: boolean; 
    totalCost?: number; 
    status: BookingStatus; 
    deposit?: number; 
    cancellationPolicy?: string; 
    canceledAt?: number; 
    isGuaranteed?: boolean; 
    rooms: RoomInfo[];
};
import { BOOKING_SERVICE_ORDER_STATUS, BookingServiceOrderStatus, BookingStatus, EquipmentStatus } from "../constants/admin/constants";
import { BookingConsumable, BookingEquipmentDamaged, BookingService, BookingServiceOrder, Customer, Employee, Genders, OrderItem, Role, RoomInfo } from "./hotel";

export type RoomTypeForm = {
    id: number;
    name: string;
    description?: string;
    singleBedCount?: number;
    doubleBedCount?: number;
    extraBedAvailable?: boolean;
    sizeRange?: string;
    maxOccupancy?: number;
    basePricePerNight?: number;
};

export type RoomInfoForm = {
    id: number;
    roomNumber: string;
    floor?: number;
    size?: number;
    isAvailable?: boolean;
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
    description?: string;
    images?: string;
    roomType: RoomTypeForm;
    consumables?: ConsumableForm[];
    equipmentList?: EquipmentForm[];
    imageList?: ImageForm[];
};
export type ImageForm = {
    id: number;
    url: string;
    type?: string;
    size?: number;
    roomId?: number;
    publicId?: string;
    fileName?: string;
    description?: string;
}

export type EmployeeInfo = Employee & {
    roles?: Role[];
};

export type ConsumableCategoriesForm = {
    id: number;
    name: string;
    description?: string;
};

export type EquipmentCategoryForm = {
    id: number;
    name: string;
    description?: string;
};

export type ConsumableForm = {
    id: number;
    name: string;
    consumableCategory: ConsumableCategoriesForm;
    room?: RoomInfoForm | null;
    price?: number;
    quantity?: number;
    unit?: string;
    expiryDate?: number;
    barcode?: string;
    description?: string;
};

export type EquipmentForm = {
    id: number;
    name: string;
    equipmentCategory: EquipmentCategoryForm;
    room?: RoomInfoForm | null;
    installationDate?: number;
    barcode?: string;
    status?: EquipmentStatus;
    description?: string;
};


export type CustomerForm = {
    id: number;
    name?: string;
    email?: string;
    phoneNumber?: string;
    gender?: Genders;
    birthDay?: number;
    nationality?: string;
    identityNumber?: string;
    address?: string;
    notes?: string;
    hotelId?: number;
}

export type BookingForm = {
    id: number;
    customer: Customer;
    checkInDate?: number;
    checkOutDate?: number;
    bookingDate: number;
    estimatedArrivalTime?: number;
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
    hotelId?: number;
};

export interface ServiceTypeForm {
    id?: number;
    name: string;
    description?: string;
}

export interface ServiceItemForm {
    id?: number;
    serviceType: ServiceTypeForm;
    name: string;
    price: number;
    description?: string;
    image?: string;
}

export interface BookingServiceOrderForm {
    id?: number;
    bookingServiceId: number;
    orderItems: OrderItem[];
    totalPrice?: number;
    orderCreatedAt?: number;
    servicedAt?: number;
    status?: BOOKING_SERVICE_ORDER_STATUS;
    note?: string;
}
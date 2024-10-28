import { EquipmentStatus, RoomStatus } from "../constants/admin/constants";
import { ConsumableCategories, Employee, Genders, Role } from "./hotel";

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
};

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
    room?: RoomInfoForm;
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
    room?: RoomInfoForm;
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
}
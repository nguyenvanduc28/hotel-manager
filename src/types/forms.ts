import { EquipmentStatus, RoomStatus } from "../constants/admin/constants";
import { Employee, Role } from "./hotel";

export type RoomTypeForm = {
    id?: number;
    name?: string;
    description?: string;
    single_bed_count?: number;
    double_bed_count?: number;
    extra_bed_available?: boolean;
    sizeRange?: string;
    max_occupancy?: number;
    base_price_per_night?: number;
};


export type RoomInfoForm = {
    id?: number;
    roomNumber?: number;
    floor?: number;
    isAvailable?: boolean;
    currentStatus?: RoomStatus;
    description?: string;
    isSmokingAllowed?: boolean;
    lastCleaned?: number;
    roomTypeId?: number;
    amenitiesId?: number[];
}
export type EmployeeInfo = Employee & {
    roles?: Role[];
}

export type ConsumableCategoriesForm = {
    id?: number;
    name?:string;
    description?:string;
}
export type EquipmentCategoryForm = {
    id?: number;
    name?:string;
    description?:string;
}
export type ConsumableForm = {
    id?:number;
    name?:string;
    consumableCategoryId?:number;
    price?:number;
    quantity?:number;
    unit?:string;
    barcode?:string;
    expiryDate?:number;
    description?:string;
}
export type EquipmentForm = {
    id?:number;
    name?:string;
    equipmentCategoryId?:number;
    barcode?:string;
    installationDate?:number;
    status?:EquipmentStatus;
    description?:string;
}
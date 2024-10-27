import { ConsumableCategoriesForm, ConsumableForm, EquipmentCategoryForm, EquipmentForm, RoomInfoForm, RoomTypeForm } from "../../types/forms";
import axiosInstance from "../axiosInstance";

export const createConsumableCategory = async (payload: ConsumableCategoriesForm) => {
    try {
        const response = await axiosInstance.post('/admin/rooms/consumable-category', payload);
        return response.data;
    } catch (error :unknown) {
        const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Tạo tiêu hao thất bại';
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
};

export const createConsumable = async (payload: ConsumableForm) => {
    try {
        const response = await axiosInstance.post('/admin/rooms/consumable', payload);
        return response.data;
    } catch (error :unknown) {
        const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Tạo tiêu hao thất bại';
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
};

export const createEquipmentCategory = async (payload: EquipmentCategoryForm) => {
    try {
        const response = await axiosInstance.post('/admin/rooms/equipment-category', payload);
        return response.data;
    } catch (error :unknown) {
        const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Tạo tiêu hao thất bại';
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
};
export const createEquipment = async (payload: EquipmentForm) => {
    try {
        const response = await axiosInstance.post('/admin/rooms/equipment', payload);
        return response.data;
    } catch (error :unknown) {
        const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Tạo tiêu hao thất bại';
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
};

export const createRoomType = async (payload: RoomTypeForm) => {
    try {
        const response = await axiosInstance.post('/admin/rooms/roomtype', payload);
        return response.data;
    } catch (error :unknown) {
        const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Tạo tiêu hao thất bại';
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
};
export const createRoom = async (payload: RoomInfoForm) => {
    try {
        const response = await axiosInstance.post('/admin/rooms/create', payload);
        return response.data;
    } catch (error :unknown) {
        const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Tạo tiêu hao thất bại';
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
};
export const getAllRoom = async () => {
    try {
        const response = await axiosInstance.get('/admin/rooms/getall');
        return response.data;
    } catch (error :unknown) {
        const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Lấy danh sách phòng thất bại';
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
};

export const getConsumableCategories = async () => {
    try {
        const response = await axiosInstance.get('/admin/rooms/consumable-category');
        return response.data;
    } catch (error :unknown) {
        const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Tạo tiêu hao thất bại';
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
};

export const getConsumables = async () => {
    try {
        const response = await axiosInstance.get('/admin/rooms/consumable');
        return response.data;
    } catch (error :unknown) {
        const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Tạo tiêu hao thất bại';
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
};
export const getEquipmentCategories = async () => {
    try {
        const response = await axiosInstance.get('/admin/rooms/equipment-category');
        return response.data;
    } catch (error :unknown) {
        const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Tạo tiêu hao thất bại';
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
};

export const getEquipment = async () => {
    try {
        const response = await axiosInstance.get('/admin/rooms/equipment');
        return response.data;
    } catch (error :unknown) {
        const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Tạo tiêu hao thất bại';
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
};

export const getRoomTypes = async () => {
    try {
        const response = await axiosInstance.get('/admin/rooms/roomtype');
        return response.data;
    } catch (error: unknown) {
        const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Lấy danh sách loại phòng thất bại';
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
};
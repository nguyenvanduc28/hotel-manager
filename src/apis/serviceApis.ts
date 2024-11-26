import { ServiceTypeForm, ServiceItemForm } from "../types/forms";
import axiosInstance from "./axiosInstance";

export const getServiceTypeList = async () => {
    try {
        const response = await axiosInstance.get('/admin/service/service-type-list');
        return response.data;
    } catch (error: unknown) {
        const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Lấy danh sách loại dịch vụ thất bại';
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
};

export const createServiceType = async (payload: ServiceTypeForm) => {
    try {
        const response = await axiosInstance.post('/admin/service/create-service-type', payload);
        return response.data;
    } catch (error: unknown) {
        const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Tạo loại dịch vụ thất bại';
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
};

export const updateServiceType = async (payload: ServiceTypeForm) => {
    try {
        const response = await axiosInstance.put('/admin/service/update-service-type', payload);
        return response.data;
    } catch (error: unknown) {
        const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Cập nhật loại dịch vụ thất bại';
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
};

export const getServiceItemList = async (serviceTypeId: number) => {
    try {
        const response = await axiosInstance.get('/admin/service/service-item-list', {
            params: { serviceTypeId }
        });
        return response.data;
    } catch (error: unknown) {
        const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Lấy danh sách dịch vụ thất bại';
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
};

export const createServiceItem = async (payload: ServiceItemForm) => {
    try {
        const response = await axiosInstance.post('/admin/service/create-service-item', payload);
        return response.data;
    } catch (error: unknown) {
        const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Tạo dịch vụ thất bại';
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
};

export const updateServiceItem = async (payload: ServiceItemForm) => {
    try {
        const response = await axiosInstance.put('/admin/service/update-service-item', payload);
        return response.data;
    } catch (error: unknown) {
        const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Cập nhật dịch vụ thất bại';
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
};

export const updateBookingServiceOrderStatus = async (orderId: number, status: string) => {
    try {
        const response = await axiosInstance.put(`/admin/service/update-booking-service-order-status?orderId=${orderId}&status=${status}`);
        return response.data;
    } catch (error: unknown) {
        const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Cập nhật trạng thái đơn dịch vụ thất bại';
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
};

export const getBookingServiceOrderList = async (status: string, hotelId: number, serviceTypeId: number) => {
    try {
        const response = await axiosInstance.get(`/admin/service/booking-service-order-list?status=${status}&hotelId=${hotelId}&serviceTypeId=${serviceTypeId}`);
        return response.data;
    } catch (error: unknown) {
        const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Lấy danh sách đơn dịch vụ thất bại';
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
};

export const getServiceCount = async (serviceTypeId: number) => {
    try {
        const response = await axiosInstance.get(`/admin/service/service-count?serviceTypeId=${serviceTypeId}`);
        return response.data;
    } catch (error: unknown) {
        const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Lấy số lượng đơn dịch vụ thất bại';
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
};
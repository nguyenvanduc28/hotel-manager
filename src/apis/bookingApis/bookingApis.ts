import { CustomerForm } from "../../types/forms";
import axiosInstance from "../axiosInstance";

export const getCustomers = async () => {
    try {
        const response = await axiosInstance.get('/admin/customers/getall');
        return response.data;
    } catch (error: unknown) {
        const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Lấy danh sách khách hàng thất bại';
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
};

export const createCustomer = async (payload: CustomerForm) => {
    try {
        const response = await axiosInstance.post('/admin/customers/create', payload);
        return response.data;
    } catch (error :unknown) {
        const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Tạo khách hàng thất bại';
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
};
import { Booking } from "../../types/hotel";
import axiosInstance from "../axiosInstance";

export const getAllInvoices = async () => {
    try {
        const response = await axiosInstance.get('/admin/invoices/getall');
        return response.data;
    } catch (error: unknown) {
        const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Lấy danh sách hóa đơn thất bại';
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
};

export const getInvoiceById = async (id: number) => {
    try {
        const response = await axiosInstance.get(`/admin/invoices/${id}`);
        return response.data;
    } catch (error: unknown) {
        const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Lấy thông tin hóa đơn thất bại';
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
};

export const getInvoicesByCustomerId = async (customerId: number) => {
    try {
        const response = await axiosInstance.get(`/admin/invoices/customer/${customerId}`);
        return response.data;
    } catch (error: unknown) {
        const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Lấy danh sách hóa đơn theo khách hàng thất bại';
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
}; 

export const createInvoice = async (bookingDto: Booking) => {
    try {
        const response = await axiosInstance.post('/admin/invoices/create', bookingDto);
        return response.data;
    } catch (error: unknown) {
        const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Tạo hóa đơn thất bại';
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
};
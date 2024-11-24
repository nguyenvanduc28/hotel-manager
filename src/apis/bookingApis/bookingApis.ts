import { BookingForm, BookingServiceOrderForm, CustomerForm } from "../../types/forms";
import { Booking, BookingServiceOrder } from "../../types/hotel";
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
    } catch (error: unknown) {
        const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Tạo khách hàng thất bại';
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
};

export const createBooking = async (payload: BookingForm) => {
    try {
        const response = await axiosInstance.post('/admin/bookings/create', payload);
        return response.data;
    } catch (error: unknown) {
        const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Tạo đặt phòng thất bại';
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
};

export const getBookings = async () => {
    try {
        const response = await axiosInstance.get('/admin/bookings/getall');
        return response.data;
    } catch (error: unknown) {
        const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Lấy danh sách phòng thất bại';
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
};

export const searchBooking = async (status: string) => {
    try {
        const response = await axiosInstance.get('/admin/bookings/search', {
            params: { status }
        });
        return response.data;
    } catch (error: unknown) {
        const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Lấy danh sách phòng thất bại';
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
};

export const searchBookingByCusName = async (customerName: string) => {
    try {
        const response = await axiosInstance.get('/admin/bookings/search-cusname', {
            params: { customerName }
        });
        return response.data;
    } catch (error: unknown) {
        const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Lấy danh sách phòng theo tên thất bại';
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
};

export const confirmBooking = async (bookingId: number) => {
    try {
        const response = await axiosInstance.post(`/admin/bookings/confirm/${bookingId}`);
        return response.data;
    } catch (error: unknown) {
        const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Lấy danh sách phòng thất bại';
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
};

export const checkInBooking = async (bookingId: number) => {
    try {
        const response = await axiosInstance.post(`/admin/bookings/checkin/${bookingId}`);
        return response.data;
    } catch (error: unknown) {
        const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Checkin thất bại';
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
};

export const getBookingById = async (bookingId: number) => {
    try {
        const response = await axiosInstance.get(`/admin/bookings/${bookingId}`);
        return response.data;
    } catch (error: unknown) {
        const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Lấy thông tin đặt phòng thất bại';
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
};

export const checkoutBooking = async (bookingId: number, payload: Booking) => {
    try {
        const response = await axiosInstance.post(`/admin/bookings/${bookingId}/checkout`, payload);
        return response.data;
    } catch (error: unknown) {
        const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Checkout thất bại';
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
};

export const unConfirmBooking = async (bookingId: number) => {
    try {
        const response = await axiosInstance.post(`/admin/bookings/${bookingId}/unconfirm`);
        return response.data;
    } catch (error: unknown) {
        const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Hủy xác nhận thất bại';
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
};

export const unCheckInBooking = async (bookingId: number) => {
    try {
        const response = await axiosInstance.post(`/admin/bookings/${bookingId}/uncheckin`);
        return response.data;
    } catch (error: unknown) {
        const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Hủy check-in thất bại';
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
};

export const confirmServicedForOrder = async (orderId: number) => {
    try {
        const response = await axiosInstance.post(`/admin/bookings/${orderId}/confirm-serviced`);
        return response.data;
    } catch (error: unknown) {
        const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Xác nhận hoàn thành dịch vụ thất bại';
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
};

export const deleteServiceOrder = async (orderId: number) => {
    try {
        const response = await axiosInstance.post(`/admin/bookings/${orderId}/delete`);
        return response.data;
    } catch (error: unknown) {
        const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Xóa đơn dịch vụ thất bại';
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
};

export const createServiceOrder = async (bookingId: number, payload: BookingServiceOrderForm) => {
    try {
        const response = await axiosInstance.post(`/admin/bookings/${bookingId}/service-order`, payload);
        return response.data;
    } catch (error: unknown) {
        const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Tạo đơn dịch vụ thất bại';
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
};

export const updateServiceOrder = async (orderId: number, payload: BookingServiceOrder) => {
    try {
        const response = await axiosInstance.put(`/admin/bookings/${orderId}/service-order`, payload);
        return response.data;
    } catch (error: unknown) {
        const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Cập nhật đơn dịch vụ thất bại';
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
};

export const getServicesByBookingId = async (bookingId: number) => {
    try {
        const response = await axiosInstance.get(`/admin/bookings/${bookingId}/services`);
        return response.data;
    } catch (error: unknown) {
        const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Lấy danh sách dịch vụ thất bại';
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
};
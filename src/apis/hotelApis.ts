import axiosInstance from './axiosInstance';
import { HotelInfo } from '../types/hotel';

export const createHotel = async (hotelDto: HotelInfo) => {
    try {
        const response = await axiosInstance.post('/admin/hotels/create', hotelDto);
        return response.data;
    } catch (error: unknown) {
        const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Tạo khách sạn thất bại';
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
};

export const updateHotel = async (id: number, hotelDto: HotelInfo) => {
    try {
        const response = await axiosInstance.put(`/admin/hotels/update/${id}`, hotelDto);
        return response.data;
    } catch (error: unknown) {
        const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Cập nhật khách sạn thất bại';
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
};

export const getHotelInfo = async () => {
    const response = await axiosInstance.get(`/admin/hotels/get-info-hotel`);
    return response.data;
};
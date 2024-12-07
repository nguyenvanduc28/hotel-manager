import axiosInstance from "./axiosInstance";

interface ReportRequestDto {
    timePeriodStart: number;
    timePeriodEnd: number;
    serviceTypeId: number;
}

export const getGeneralReport = async (payload: ReportRequestDto) => {
    try {
        const response = await axiosInstance.post('/api/reports/general', payload);
        return response.data;
    } catch (error: unknown) {
        const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Lấy báo cáo tổng quan thất bại';
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
};

export const getServiceReport = async (payload: ReportRequestDto) => {
    try {
        const response = await axiosInstance.post('/api/reports/service', payload);
        return response.data;
    } catch (error: unknown) {
        const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Lấy báo cáo dịch vụ thất bại';
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
};

export const getRoomTypeReport = async (payload: ReportRequestDto) => {
    try {
        const response = await axiosInstance.post('/api/reports/room-type', payload);
        return response.data;
    } catch (error: unknown) {
        const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Lấy báo cáo loại phòng thất bại';
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
};

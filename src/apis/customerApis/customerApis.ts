import axiosInstance from "../axiosInstance";

export const searchCustomersByName = async (name : string) => {
    try {
        const response = await axiosInstance.get('/admin/customers/search', {
            params: { name }
        });
        return response.data;
    } catch (error :unknown) {
        const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Lấy danh sách khách hàng thất bại';
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
};
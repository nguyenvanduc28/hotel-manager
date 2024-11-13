import axiosInstance from "../axiosInstance";

export const uploadImage = async (file: File) => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await axiosInstance.post('/api/images/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error: unknown) {
        const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Tải ảnh lên thất bại';
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
};

export const uploadMultipleImages = async (files: File[]) => {
    try {
        const formData = new FormData();
        files.forEach(file => {
            formData.append('files', file);
        });

        const response = await axiosInstance.post('/api/images/upload/multiple', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        console.log("response", response.data);
        return response.data;
    } catch (error: unknown) {
        const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Tải nhiều ảnh lên thất bại';
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
};

export const getImagesByRoomId = async (roomId: number) => {
    try {
        const response = await axiosInstance.get(`/api/images/room/${roomId}`);
        return response.data;
    } catch (error: unknown) {
        const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Lấy danh sách ảnh thất bại';
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
};

export const deleteImage = async (publicId: string) => {
    try {
        const response = await axiosInstance.delete(`/api/images/${publicId}`);
        return response.data;
    } catch (error: unknown) {
        const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Xóa ảnh thất bại';
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
}; 
import { ConsumableCategoriesForm, ConsumableForm, EquipmentCategoryForm, EquipmentForm, RoomInfoForm, RoomTypeForm } from "../../types/forms";
import { RoomPrice } from "../../types/hotel";
import axiosInstance from "../axiosInstance";

export const createConsumableCategory = async (payload: ConsumableCategoriesForm) => {
    try {
        const response = await axiosInstance.post('/admin/rooms/consumable-category', payload);
        return response.data;
    } catch (error :unknown) {
        const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Tạo danh mục đồ tiêu hao thất bại';
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
};

export const createConsumable = async (payload: ConsumableForm) => {
    try {
        const response = await axiosInstance.post('/admin/rooms/consumable', payload);
        return response.data;
    } catch (error :unknown) {
        const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Tạo đồ tiêu hao thất bại';
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
};
export const createConsumableList = async (payload: ConsumableForm[]) => {
    try {
        const response = await axiosInstance.post('/admin/rooms/consumable-list', payload);
        return response.data;
    } catch (error :unknown) {
        const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Tạo danh sách đồ tiêu hao thất bại';
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
};

export const updateConsumable = async (payload: ConsumableForm) => {
    try {
        const response = await axiosInstance.put('/admin/rooms/consumable', payload);
        return response.data;
    } catch (error: unknown) {
        const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Cập nhật tiêu hao thất bại';
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
};

export const getConsumableById = async (id: number) => {
    try {
        const response = await axiosInstance.get(`/admin/rooms/consumable/${id}`);
        return response.data;
    } catch (error: unknown) {
        const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Lấy thông tin tiêu hao thất bại';
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

export const createEquipmentList = async (payload: EquipmentForm[]) => {
    try {
        const response = await axiosInstance.post('/admin/rooms/equipment-list', payload);
        return response.data;
    } catch (error :unknown) {
        const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Tạo danh sách thiết bị thất bại';
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
};


export const updateEquipment = async (payload: EquipmentForm) => {
    try {
        const response = await axiosInstance.put('/admin/rooms/equipment', payload);
        return response.data;
    } catch (error: unknown) {
        const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Cập nhật tiêu hao thất bại';
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
};

export const getEquipmentById = async (id: number) => {
    try {
        const response = await axiosInstance.get(`/admin/rooms/equipment/${id}`);
        return response.data;
    } catch (error: unknown) {
        const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Lấy thông tin thiết bị thất bại';
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
export const updateRoom = async (payload: RoomInfoForm) => {
    try {
        const response = await axiosInstance.put('/admin/rooms/update', payload);
        return response.data;
    } catch (error: unknown) {
        const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Lấy thông tin phòng thất bại';
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

export const getRoomById = async (id: number) => {
    try {
        const response = await axiosInstance.get(`/admin/rooms/${id}`);
        return response.data;
    } catch (error: unknown) {
        const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Lấy thông tin phòng thất bại';
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
};



export const getAvailableRooms = async (checkInDate: number, checkOutDate: number, hotelId: number) => {
    try {
        const response = await axiosInstance.get('/api/search/room/avai', {
            params: {
                checkInDate,
                checkOutDate,
                hotelId
            }
        });
        return response.data;
    } catch (error: unknown) {
        const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Lấy danh sách phòng trống thất bại';
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
export const getConsumablesAvailable = async (roomId:number) => {
    try {
        const response = await axiosInstance.get('/admin/rooms/consumable/available', {
            params: {
                roomId
            }
        });
        return response.data;
    } catch (error: unknown) {
        const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Lấy danh sách đồ dùng tiêu hao thất bại';
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
export const getEquipmentAvailable = async (roomId:number) => {
    try {
        const response = await axiosInstance.get('/admin/rooms/equipment/available', {
            params: {
                roomId
            }
        });
        return response.data;
    } catch (error: unknown) {
        const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Lấy danh sách tiện ích thất bại';
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

export const getRoomTypesWithPriceInRange = async (checkInDate: number, checkOutDate: number) => {
    try {
        const response = await axiosInstance.get('/admin/rooms/roomtype/price', {
            params: {
                checkInDate,
                checkOutDate
            }
        });
        return response.data;
    } catch (error: unknown) {
        const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Lấy danh sách loại phòng theo khoảng thời gian thất bại';
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
};

export const updatePriceRoomType = async (payload: RoomPrice) => {
    try {
        const response = await axiosInstance.put('/admin/rooms/roomtype/price', payload);
        return response.data;
    } catch (error: unknown) {
        const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Cập nhật giá phòng thất bại';
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
};

export const getConsumablesByRoomId = async (roomId: number) => {
    try {
        const response = await axiosInstance.get(`/admin/rooms/consumable/room/${roomId}`);
        return response.data;
    } catch (error: unknown) {
        const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Lấy danh sách đồ tiêu hao theo phòng thất bại';
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
};

export const getEquipmentsByRoomId = async (roomId: number) => {
    try {
        const response = await axiosInstance.get(`/admin/rooms/equipment/room/${roomId}`);
        return response.data;
    } catch (error: unknown) {
        const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Lấy danh sách thiết bị theo phòng thất bại';
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
};
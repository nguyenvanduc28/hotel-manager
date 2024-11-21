import axiosInstance from './axiosInstance';
import { Employee } from '../types/hotel';

export const getAllEmployees = async () => {
    try {
        const response = await axiosInstance.get('/admin/employee/getall');
        return response.data;
    } catch (error: unknown) {
        const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Lấy danh sách nhân viên thất bại';
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
};

export const getEmployeeById = async (id: number) => {
    try {
        const response = await axiosInstance.get(`/admin/employee/${id}`);
        return response.data;
    } catch (error: unknown) {
        const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Lấy thông tin nhân viên thất bại';
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
};

export const createEmployee = async (employeeDto: Employee) => {
    try {
        const response = await axiosInstance.post('/admin/employee/create', employeeDto);
        return response.data;
    } catch (error: unknown) {
        const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Tạo nhân viên thất bại';
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
};

export const updateEmployee = async (id: number, employeeDto: Employee) => {
    try {
        const response = await axiosInstance.put(`/admin/employee/update/${id}`, employeeDto);
        return response.data;
    } catch (error: unknown) {
        const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Cập nhật thông tin nhân viên thất bại';
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
};

export const getEmployeeInfo = async () => {
    try {
        const response = await axiosInstance.get('/admin/employee/getInfoEmployee');
        return response.data;
    } catch (error: unknown) {
        const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Lấy thông tin nhân viên thất bại';
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
}
// src/api/authApi.ts
import { Role } from "../../types/hotel";
import axiosInstance from "../axiosInstance";

interface LoginPayload {
    username: string;
    password: string;
}

export const login = async (payload: LoginPayload) => {
    try {
        const response = await axiosInstance.post('/admin/auth/login', payload);

        const token = response.data.token;

        if (token) {
            localStorage.setItem('token', token);
        }

        return response.data;
    } catch (error) {
        console.error('Đăng nhập thất bại:', error);
        throw error;
    }
};


interface RegisterPayload {
    username: string;
    password: string;
    roles: Role[];
}

export const register = async (payload: RegisterPayload) => {
    try {
        const response = await axiosInstance.post('/admin/auth/register', payload);
        return response.data;
    } catch (error) {
        console.error('Đăng ký thất bại:', error);
        throw error;
    }
};

interface VerifyTokenPayload {
    token: string;
}

export const verifyToken = async (payload: VerifyTokenPayload) => {
    try {
        const response = await axiosInstance.post('/admin/auth/verify-token', payload);
        
        return response.data;
    } catch (error) {
        console.error('Xác minh token thất bại:', error);
        throw error;
    }
};

export const registerAdmin = async (payload: RegisterPayload) => {
    try {
        const response = await axiosInstance.post('/admin/auth/register-admin', payload);
        return response.data;
    } catch (error) {
        console.error('Đăng ký thất bại:', error);
        throw error;
    }
};
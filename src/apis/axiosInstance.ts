import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Tạo một instance của axios
const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080', // Đặt URL cơ bản của API
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor cho yêu cầu
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        
        // Kiểm tra xem URL có phải là API công khai không
        const publicPaths = ['/admin/auth/login', '/admin/auth/register', '/admin/auth/verify-token']; // Danh sách các API công khai
        if (token && !publicPaths.includes(config.url!)) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Cấu hình router
const router = {
    push: (path: string) => {
        const navigate = useNavigate();
        navigate(path);
    }
};

// Interceptor cho phản hồi
axiosInstance.interceptors.response.use(
    (response) => response.data,
    async (error) => {
        const originalRequest = error.config;

        // Kiểm tra lỗi 401 và xử lý
        if (error.response.status === 401 && originalRequest.url !== '/admin/auth/login') {
            router.push('/login');
            return Promise.reject(error);
        }
        
        return Promise.reject(error);
    }
);

export default axiosInstance;

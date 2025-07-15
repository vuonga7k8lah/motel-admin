import axios, { AxiosInstance } from "axios";
import { store } from "../redux/store";

// Tạo instance của axios với cấu hình mặc định
const axiosInstance: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8083/",
    timeout: 10000, //
    headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        //Lấy accessToken từ Redux Toolkit
        const token = store.getState().auth.accessToken;
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Thêm interceptor cho response
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            console.log("Unauthorized, logging out...");
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;

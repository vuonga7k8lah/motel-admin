import { ToastOptions } from "react-toastify";

import { loginSuccess } from "../redux/slice/authSlice";
import { loginResponse } from "../types/auth.type";

import axios, { AxiosInstance } from "axios";

type LoginPayload = {
    email: string;
    password: string;
};

const login = async (
    payload: LoginPayload,
    notify: (message: string, options?: ToastOptions) => void,
    dispatch: any
) => {
    try {
        const axiosInstance: AxiosInstance = axios.create({
            baseURL: import.meta.env.VITE_API_URL || "http://localhost:8083/",
            timeout: 10000, //
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
        });
        const response = await axiosInstance.post<LoginPayload[]>(
            "auth/sign-in",
            payload
        );
        if (response.status === 200) {
            const data: loginResponse = {
                // @ts-ignore
                accessToken: response.data.data.access_token,
                // @ts-ignore
                refreshToken: response.data.data.refresh_token,
                isAuthenticated: true,
                 // @ts-ignore
                user:{
                     // @ts-ignore
                    username: response.data?.data.username,
                     // @ts-ignore
                    email: response.data?.data.email,
                     // @ts-ignore
                    role: response.data?.data.role,
                     // @ts-ignore
                    id: response.data?.data.id
                }
            };

            // @ts-ignore
            notify(response.message || "Login successful!", {
                type: "success",
            });
            dispatch(loginSuccess(data));
            return true;
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log(error.response);

            if (error.response && error.response.data.detail) {
                notify(error.response.data.detail, { type: "error" });
            } else {
                notify("An unexpected error occurred. Please try again.", {
                    type: "error",
                });
            }
        }
        return false;
    }
};

export { login };

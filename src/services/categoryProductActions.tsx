// categoryProductActions.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../configs/axios";
import { payloadCreate, payloadGetAll } from "../types/categoryProductType";
import { RootState } from "../redux/store";

export const create = createAsyncThunk(
    "categoryProduct/create",
    async (payload: payloadCreate, { getState }) => {
        const state = getState() as RootState;
        const token = state.auth.accessToken;

        const response = await axiosInstance.post<payloadCreate[]>(
            "/api/v1/products/categories",
            payload,
            {
                headers: {
                    Authorization: token ? `Bearer ${token}` : "",
                },
            }
        );
        return response.data;
    }
);

export const getAll = createAsyncThunk(
    "categoryProduct/getAll",
    async (payload: payloadGetAll, { getState }) => {
        const state = getState() as RootState;
        const token = state.auth.accessToken;
        const response = await axiosInstance.get<payloadGetAll[]>(
            `/api/v1/products/categories?limit=${payload.limit}&page=${payload.page}`,
            {
                headers: {
                    Authorization: token ? `Bearer ${token}` : "",
                },
            }
        );
        return response.data;
    }
);

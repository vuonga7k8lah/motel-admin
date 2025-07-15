import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // sử dụng localStorage để lưu trữ
import authReducer from "./slice/authSlice";
import productCategoryReducer from "./slice/productCategorySlice";
import { combineReducers } from "redux";
import axiosInstance from "../configs/axios";

// Kết hợp các reducer
const rootReducer = combineReducers({
    auth: authReducer,
    productCategory: productCategoryReducer,
});

// Cấu hình redux-persist
const persistConfig = {
    key: "root",
    storage,
};

// Tạo persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Tạo store với persisted reducer
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            thunk: {
                extraArgument: axiosInstance,
            },
        }),
});

// Tạo persistor để quản lý việc lưu trữ
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export default store;

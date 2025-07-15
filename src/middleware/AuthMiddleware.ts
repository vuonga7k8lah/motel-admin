import { Middleware } from "@reduxjs/toolkit";
import { RootState } from "../redux/store";
import { logout } from "../redux/slice/authSlice";

const authMiddleware: Middleware<{}, RootState> =
    (store) => (next) => (action) => {
        const state = store.getState();
        // Kiểm tra nếu người dùng không xác thực và hành động không phải là đăng nhập
        if (!state.auth.isAuthenticated && action.type !== "auth/logout") {
            console.warn("User not authenticated, logging out...");
            store.dispatch(logout());
        }

        return next(action);
    };

export default authMiddleware;

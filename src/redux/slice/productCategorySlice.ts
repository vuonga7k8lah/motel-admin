// productCategorySlice.ts
import { createSlice } from "@reduxjs/toolkit";
import { create, getAll } from "../../services/categoryProductActions";

const productCategorySlice = createSlice({
    name: "productCategory",
    initialState: {
        categories: [],
        loading: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(create.pending, (state) => {
                state.loading = true;
            })
            .addCase(create.fulfilled, (state, action) => {
                state.categories.push(action.payload);
                state.loading = false;
            })
            .addCase(create.rejected, (state) => {
                state.loading = false;
            })
            .addCase(getAll.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAll.fulfilled, (state, action) => {
                state.categories = action.payload.info;
                state.loading = false;
            })
            .addCase(getAll.rejected, (state) => {
                state.loading = false;
            });
    },
});

export default productCategorySlice.reducer;

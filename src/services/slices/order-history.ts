import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getOrdersApi } from '../../utils/burger-api';
import { TOrder } from '../../utils/types';

export type TStateOrderHistory = {
  orders: TOrder[];
  loading: boolean;
  error: string | null;
};

const initialState: TStateOrderHistory = {
  orders: [],
  loading: false,
  error: null
};

export const fetchOrderHistory = createAsyncThunk(
  'user/orderHistory',
  getOrdersApi
);

export const userOrdersHistorySlice = createSlice({
  name: 'orderHistory',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderHistory.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchOrderHistory.rejected, (state, action) => {
        state.error =
          action.error.message || 'Error occurs while fetching order history';
        state.loading = false;
      });
  },
  selectors: {
    getOrderHistory: (state) => state.orders,
    getOrderHistoryError: (state) => state.error,
    getOrderHistoryLoading: (state) => state.loading
  }
});

export const { getOrderHistory, getOrderHistoryError, getOrderHistoryLoading } =
  userOrdersHistorySlice.selectors;

export default userOrdersHistorySlice;

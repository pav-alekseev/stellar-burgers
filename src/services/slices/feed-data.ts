import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { TOrder } from '@utils-types';
import { getFeedsApi } from '../../utils/burger-api';
import { getOrderByNumberApi } from '../../utils/burger-api';

export type TStateFeed = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  modalOrder: TOrder | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: TStateFeed = {
  orders: [],
  total: 0,
  totalToday: 0,
  modalOrder: null,
  error: null,
  isLoading: false
};

export const fetchFeedData = createAsyncThunk('feed/data', getFeedsApi);

export const getOrderByNumber = createAsyncThunk(
  'feed/getOrder',
  async (number: number, { rejectWithValue }) => {
    try {
      const response = await getOrderByNumberApi(number);

      return response;
    } catch (error) {
      return rejectWithValue('Error while fetching data');
    }
  }
);

export const feedDataSlice = createSlice({
  name: 'feedData',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeedData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeedData.fulfilled, (state, action) => {
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
        state.isLoading = false;
      })
      .addCase(fetchFeedData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Error with the feed';
      })
      .addCase(getOrderByNumber.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.isLoading = false;
        state.modalOrder = action.payload.orders[0];
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Error with the order';
      });
  },
  selectors: {
    getFeedOrders: (state) => state.orders,
    getTotalEmountOrders: (state) => state.total,
    getTotalEmountToday: (state) => state.totalToday,
    getModalOrder: (state) => state.modalOrder,
    getLoading: (state) => state.isLoading,
    getError: (state) => state.error
  }
});

export const {
  getFeedOrders,
  getTotalEmountOrders,
  getTotalEmountToday,
  getModalOrder,
  getLoading,
  getError
} = feedDataSlice.selectors;

export default feedDataSlice;

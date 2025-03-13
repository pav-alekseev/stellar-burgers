import {
  nanoid,
  createSlice,
  createAsyncThunk,
  PayloadAction
} from '@reduxjs/toolkit';

import { TOrder, TConstructorIngredient, TIngredient } from '@utils-types';
import { orderBurgerApi } from '../../utils/burger-api';

type TStateBurgerConstructor = {
  constructorItems: {
    bun: TIngredient | null;
    ingredients: Array<TConstructorIngredient>;
  };
  orderRequest: boolean;
  orderModalData: TOrder | null;
  isLoading: boolean;
  error?: string | null;
};

const initialState: TStateBurgerConstructor = {
  constructorItems: {
    bun: null,
    ingredients: []
  },
  orderRequest: false,
  orderModalData: null,
  isLoading: false,
  error: null
};

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (data: string[]) => {
    const response = await orderBurgerApi(data);
    return response;
  }
);

export const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.constructorItems.bun = action.payload;
        } else {
          state.constructorItems.ingredients.push(action.payload);
        }
      },
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: nanoid() }
      })
    },
    removeIngredient: (
      state,
      action: PayloadAction<TConstructorIngredient>
    ) => {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          ({ id }) => id !== action.payload.id
        );
    },
    clearConstructor: () => initialState,
    moveUpIngredient: (state, action: PayloadAction<number>) => {
      const index = action.payload;

      if (index > 0) {
        const ingredients = state.constructorItems.ingredients;

        const temp = ingredients[index - 1];
        ingredients[index - 1] = ingredients[index];
        ingredients[index] = temp;
      }
    },
    moveDownIngredient: (state, action: PayloadAction<number>) => {
      const index = action.payload;

      if (index < state.constructorItems.ingredients.length - 1) {
        const ingredients = state.constructorItems.ingredients;

        const temp = ingredients[index + 1];
        ingredients[index + 1] = ingredients[index];
        ingredients[index] = temp;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload.order;
        state.constructorItems.bun = null;
        state.constructorItems.ingredients = [];
        state.error = null;
      });
  },
  selectors: {
    getConstructorItems: ({ constructorItems }) => constructorItems,
    getOrderRequest: ({ orderRequest }) => orderRequest,
    getOrderModalData: ({ orderModalData }) => orderModalData,
    getLoading: ({ isLoading }) => isLoading,
    getError: ({ error }) => error
  }
});

export const {
  addIngredient,
  removeIngredient,
  moveUpIngredient,
  moveDownIngredient,
  clearConstructor
} = burgerConstructorSlice.actions;

export const {
  getConstructorItems,
  getOrderRequest,
  getOrderModalData,
  getLoading,
  getError
} = burgerConstructorSlice.selectors;

export default burgerConstructorSlice;

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';

import { getCookie, setCookie, deleteCookie } from '../../utils/cookie';
import {
  registerUserApi,
  loginUserApi,
  getUserApi,
  updateUserApi,
  logoutApi
} from '../../utils/burger-api';
import { TRegisterData } from '../../utils/burger-api';

export type TStateUser = {
  isAuthenticationChecked: boolean;
  isAuthenticated: boolean;
  user: TUser | null;
  error: string | null;
  isLoading: boolean;
};

const initialState: TStateUser = {
  isAuthenticationChecked: false,
  isAuthenticated: false,
  user: null,
  error: null,
  isLoading: false
};

export const fetchUser = createAsyncThunk('user/userApi', getUserApi);

export const registerUser = createAsyncThunk(
  'user/register',
  async ({ email, password, name }: TRegisterData) => {
    const { user, refreshToken, accessToken } = await registerUserApi({
      email,
      password,
      name
    });

    localStorage.setItem('refreshToken', refreshToken);
    setCookie('accessToken', accessToken);

    return user;
  }
);

export const loginUser = createAsyncThunk(
  'user/login',
  async ({ email, password }: Omit<TRegisterData, 'name'>) => {
    const { user, refreshToken, accessToken } = await loginUserApi({
      email,
      password
    });

    localStorage.setItem('refreshToken', refreshToken);
    setCookie('accessToken', accessToken);

    return user;
  }
);

export const logoutUser = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();

      localStorage.clear();
      deleteCookie('accessToken');
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateUser = createAsyncThunk('user/update', updateUserApi);

export const userDataSlice = createSlice({
  name: 'userData',
  initialState,
  reducers: {
    checkAuthentication: (state) => {
      state.isAuthenticationChecked = true;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.isAuthenticationChecked = true;
        state.user = action.payload.user;
        state.isLoading = false;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.isAuthenticationChecked = true;
        state.isAuthenticated = false;
        state.user = null;
        state.isLoading = false;
        state.error =
          action.error.message || 'Error occurs while fetching user data';
      })

      .addCase(registerUser.pending, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload;
        state.isLoading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error =
          action.error.message || 'Error occurs while registering the user';
      })

      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isAuthenticationChecked = true;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.isLoading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isAuthenticationChecked = true;
        state.isLoading = false;
        state.error =
          action.error.message || 'Error occurs while login the user';
      })

      .addCase(logoutUser.pending, (state) => {
        state.isAuthenticated = true;
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.isLoading = false;

        deleteCookie('accessToken');
        localStorage.removeItem('refreshToken');
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = action.error.message || 'Error occurs while logout user';
      })

      .addCase(updateUser.pending, (state) => {
        state.isAuthenticated = true;
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.isLoading = false;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message || 'Error occurs while updating user data';
      });
  },
  selectors: {
    getIsAuthenticationChecked: (state) => state.isAuthenticationChecked,
    getIsAuthenticated: (state) => state.isAuthenticated,
    getUser: (state) => state.user,
    getIsLoading: (state) => state.isLoading,
    getError: (state) => state.error
  }
});

export const checkUserAuthentication = createAsyncThunk(
  'user/checkUser',
  (_, { dispatch }) => {
    if (getCookie('accessToken')) {
      dispatch(fetchUser()).finally(() => {
        dispatch(checkAuthentication());
      });
    } else {
      dispatch(checkAuthentication());
    }
  }
);

export const { checkAuthentication } = userDataSlice.actions;

export const {
  getIsAuthenticationChecked,
  getIsAuthenticated,
  getUser,
  getIsLoading,
  getError
} = userDataSlice.selectors;

export default userDataSlice;

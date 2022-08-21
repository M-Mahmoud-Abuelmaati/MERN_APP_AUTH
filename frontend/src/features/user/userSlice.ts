import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import axios from "axios";

export interface User {
  _id: string;
  accessToken: string;
  refreshToken: string;
  name: string;
  email: string;
  password: string;
}

export interface UserState {
  value?: User;
  status: string;
  error?: string | null;
  accessTokenState?: string;
}

const initialState: UserState = {
  status: "idle",
};

export const refreshToken = createAsyncThunk(
  "user/refreshToken",
  async (rToken: string | null) => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/refreshToken",
        {
          headers: { authorization: `Bearer ${rToken}` },
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response.data.error);
    }
  }
);

export const checkAuth = createAsyncThunk(
  "user/checkAuth",
  async (accessToken: string | null) => {
    try {
      const response = await axios.get("http://localhost:4000/api/services", {
        headers: { authorization: `Bearer ${accessToken}` },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response.data.error);
    }
  }
);

export const signupUser = createAsyncThunk(
  "user/signup",
  async (data: { name: string; email: string; password: string }) => {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/user/signup",
        data
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response.data.error);
    }
  }
);

export const loginUser = createAsyncThunk(
  "user/login",
  async (data: { email: string; password: string }) => {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/user/login",
        data
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response.data.error);
    }
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logoutUser: (state, action: PayloadAction) => {
      console.log("Logging out");
      state.value = undefined;
      localStorage.clear();
    },
  },
  extraReducers(builder) {
    builder
      //Signup User
      .addCase(signupUser.pending, (state) => {
        state.status = "pending";
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        state.value = action.payload.user;
        localStorage.setItem("atoken", action.payload.user.accessToken);
        localStorage.setItem("rtoken", action.payload.user.refreshToken);
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.error.message;
      })
      //Login User
      .addCase(loginUser.pending, (state) => {
        state.status = "pending";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        state.value = action.payload.user;
        localStorage.setItem("atoken", action.payload.user.accessToken);
        localStorage.setItem("rtoken", action.payload.user.refreshToken);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.error.message;
      })
      //checkAuth
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.value = action.payload;
        localStorage.setItem("atoken", action.payload.accessToken);
        localStorage.setItem("rtoken", action.payload.refreshToken);
      })
      .addCase(checkAuth.rejected, (state, action) => {
        if (action.error.message === "access token expired") {
          console.log("access token expired and checking for refresh token");
          state.accessTokenState = "expired";
        } else {
          localStorage.removeItem("atoken");
          localStorage.removeItem("rtoken");
        }
      })
      //RefreshToken
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.value = action.payload.user;
        localStorage.setItem("atoken", action.payload.user.accessToken);
        localStorage.setItem("rtoken", action.payload.user.refreshToken);
      })
      .addCase(refreshToken.rejected, (state, action) => {
        if (action.error.message === "refresh token expired") {
          console.log("refresh token expired logging out");
          localStorage.removeItem("atoken");
          localStorage.removeItem("rtoken");
        }
      });
  },
});

export const getUser = (state: RootState) => state.user.value;
export const getUserStatus = (state: RootState) => state.user.status;
export const getUserError = (state: RootState) => state.user.error;
export const getAccessTokenStatus = (state: RootState) =>
  state.user.accessTokenState;

export const { logoutUser } = userSlice.actions;
export default userSlice.reducer;

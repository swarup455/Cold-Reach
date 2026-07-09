import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";

export interface User {
    _id: string;
    name: string;
    email: string;
    isVerified: boolean;
    [key: string]: unknown;
}

interface LoadingState {
    register: boolean;
    verifyOTP: boolean;
    resendOTP: boolean;
    login: boolean;
    logout: boolean;
    fetchCurrentUser: boolean;
}

interface ErrorState {
    register: string | null;
    verifyOTP: string | null;
    resendOTP: string | null;
    login: string | null;
    logout: string | null;
    fetchCurrentUser: string | null;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: LoadingState;
    error: ErrorState;
}

const initialState: AuthState = {
    user: null,
    token: localStorage.getItem("token"),
    isAuthenticated: false,
    loading: {
        register: false,
        verifyOTP: false,
        resendOTP: false,
        login: false,
        logout: false,
        fetchCurrentUser: false,
    },
    error: {
        register: null,
        verifyOTP: null,
        resendOTP: null,
        login: null,
        logout: null,
        fetchCurrentUser: null,
    },
};

// ---- thunks ----

export const registerUser = createAsyncThunk(
    "auth/registerUser",
    async (
        payload: { name: string; email: string; password: string },
        { rejectWithValue }
    ) => {
        try {
            const res = await api.post("/auth/register", payload);
            return res.data.data; // user object, unverified
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Registration failed");
        }
    }
);

export const verifyOTP = createAsyncThunk(
    "auth/verifyOTP",
    async (payload: { userId: string; otp: string }, { rejectWithValue }) => {
        try {
            const res = await api.post("/auth/verify-otp", payload);
            return res.data.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "OTP verification failed");
        }
    }
);

export const resendOTP = createAsyncThunk(
    "auth/resendOTP",
    async (payload: { userId: string }, { rejectWithValue }) => {
        try {
            const res = await api.post("/auth/resend-otp", payload);
            return res.data.message;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Failed to resend OTP");
        }
    }
);

export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (payload: { email: string; password: string }, { rejectWithValue }) => {
        try {
            const res = await api.post("/auth/login", payload);
            return res.data.data; // { user, token }
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Login failed");
        }
    }
);

export const logoutUser = createAsyncThunk(
    "auth/logoutUser",
    async (_, { rejectWithValue }) => {
        try {
            await api.post("/auth/logout");
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Logout failed");
        }
    }
);

export const fetchCurrentUser = createAsyncThunk(
    "auth/fetchCurrentUser",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get("/auth/me");
            return res.data.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Failed to fetch user");
        }
    }
);

// ---- slice ----

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        clearError: (
            state,
            action: PayloadAction<keyof ErrorState>
        ) => {
            state.error[action.payload] = null;
        },
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
            state.isAuthenticated = true;
        },
    },
    extraReducers: (builder) => {
        builder
            // register
            .addCase(registerUser.pending, (state) => {
                state.loading.register = true;
                state.error.register = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading.register = false;
                state.user = action.payload;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading.register = false;
                state.error.register = action.payload as string;
            })

            // verify otp
            .addCase(verifyOTP.pending, (state) => {
                state.loading.verifyOTP = true;
                state.error.verifyOTP = null;
            })
            .addCase(verifyOTP.fulfilled, (state, action) => {
                state.loading.verifyOTP = false;
                state.user = action.payload;
            })
            .addCase(verifyOTP.rejected, (state, action) => {
                state.loading.verifyOTP = false;
                state.error.verifyOTP = action.payload as string;
            })

            // resend otp
            .addCase(resendOTP.pending, (state) => {
                state.loading.resendOTP = true;
                state.error.resendOTP = null;
            })
            .addCase(resendOTP.fulfilled, (state) => {
                state.loading.resendOTP = false;
            })
            .addCase(resendOTP.rejected, (state, action) => {
                state.loading.resendOTP = false;
                state.error.resendOTP = action.payload as string;
            })

            // login
            .addCase(loginUser.pending, (state) => {
                state.loading.login = true;
                state.error.login = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading.login = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isAuthenticated = true;
                localStorage.setItem("token", action.payload.token);
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading.login = false;
                state.error.login = action.payload as string;
            })

            // logout
            .addCase(logoutUser.pending, (state) => {
                state.loading.logout = true;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.loading.logout = false;
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
                localStorage.removeItem("token");
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.loading.logout = false;
                state.error.logout = action.payload as string;
            })

            // fetch current user
            .addCase(fetchCurrentUser.pending, (state) => {
                state.loading.fetchCurrentUser = true;
            })
            .addCase(fetchCurrentUser.fulfilled, (state, action) => {
                state.loading.fetchCurrentUser = false;
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(fetchCurrentUser.rejected, (state, action) => {
                state.loading.fetchCurrentUser = false;
                state.error.fetchCurrentUser = action.payload as string;
                state.isAuthenticated = false;
            });
    },
});

export const { clearError, setUser } = authSlice.actions;
export default authSlice.reducer;